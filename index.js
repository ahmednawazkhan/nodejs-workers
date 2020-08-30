const { createUsersConnection } = require("./db/db");
const { randomUpdateLastActivity, getUserCategories } = require("./workers");

async function main() {
    const usersCollection = await createUsersConnection()

    await randomUpdateLastActivity(usersCollection)

    const u = await getUserCategories(usersCollection)

    console.log(u)
}

main().catch(err => {
  console.error('critical error: ' + err);
})