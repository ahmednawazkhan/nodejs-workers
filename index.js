const { createUsersConnection } = require("./db/db");

async function main() {
    console.log(await createUsersConnection())
}

main().catch(err => {
  console.error('critical error: ' + err);
})