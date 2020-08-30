const { createUsersConnection } = require("./db/db");
const { randomUpdateLastActivity } = require("./workers");

async function main() {
    const usersCollection = await createUsersConnection()

    await randomUpdateLastActivity(usersCollection)
}

main().catch(err => {
  console.error('critical error: ' + err);
})