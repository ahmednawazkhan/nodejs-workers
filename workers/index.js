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

module.exports = {randomUpdateLastActivity}