const MAX_DIFF = 5;
const MIN_DIFF = 1;

async function randomUpdateLastActivity(usersCollection) {
    const users = await usersCollection.aggregate([
        { $sample: { size: 10 } },
        { $project: { email: 1, _id: 0 } }
    ]).toArray()

    const emails = users.map(u => u.email);

    for (const email of emails) {
        const diff = Math.floor(Math.random() * (MAX_DIFF - MIN_DIFF + 1)) + MIN_DIFF;
        const nowEpoch = Date.now();
        const newTime = new Date(nowEpoch - (diff * 60 * 1000));

        await usersCollection.findOneAndUpdate({ email },
            { $set: { 'meta.lastActivity': newTime } }
        );

        console.log(`meta.lastActivity for user ${email} updated to ${newTime.toISOString()}`);
    }
};

async function getUserCategories(usersCollection) {

    /**
    *
    * Here a recommended approach is to stream data to redis instead of loading it to memory
    * 
    ***/

    const categories = await usersCollection.aggregate([
        {
            $match: {
                "meta.lastActivity": {
                    $exists: true,
                    $ne: null
                }
            }
        },
        {
            $addFields: {
                computedMinutesSinceNow: {
                    $mod: [
                        {
                            $divide: [
                                { $subtract: [new Date(), '$meta.lastActivity'] },
                                60 * 1000
                            ]
                        },
                        5
                    ]
                }
            }
        },
        {
            $addFields: {
                grouper: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $and: [
                                        { $gte: ['$computedMinutesSinceNow', 1] },
                                        { $lte: ['$computedMinutesSinceNow', 2] }
                                    ]
                                },
                                then: 'A'
                            },
                            {
                                case: {
                                    $and: [
                                        { $gt: ['$computedMinutesSinceNow', 2] },
                                        { $lte: ['$computedMinutesSinceNow', 3] }
                                    ]
                                },
                                then: 'B'
                            },
                            {
                                case: {
                                    $and: [
                                        { $gte: ['$computedMinutesSinceNow', 4] },
                                        { $lte: ['$computedMinutesSinceNow', 5] }
                                    ]
                                },
                                then: 'C'
                            }
                        ],
                        default: 'D'
                    }
                }
            }
        },
        {
            $match: { grouper: { $ne: 'D' } }
        },
        {
            $group: { _id: '$grouper', users: { $addToSet: '$$ROOT' } }
        }
    ]).toArray()

    return {
        usersWithOneToTwoMinutesActivity: categories.find(c => c._id === 'A').users,
        usersCountForTwoToThreeMinutesActivity: categories.find(c => c._id === 'B').users.length,
        usersCountForFourToFiveMinutesActivity: categories.find(c => c._id === 'C').users.length
    }
}

module.exports = { randomUpdateLastActivity, getUserCategories };