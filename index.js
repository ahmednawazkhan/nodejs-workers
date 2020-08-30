const { createUsersConnection } = require('./db/db');
const { randomUpdateLastActivity, getUserCategories } = require('./workers');
const config = require('config');
const { createScheduler, startScheduler } = require('./scheduler');

async function main() {
  const usersCollection = await createUsersConnection();
  await randomUpdateLastActivity(usersCollection);

  const scheduler = await createScheduler(usersCollection);

  await startScheduler(scheduler)

}

main().catch(err => {
  console.error('critical error: ' + err);
})