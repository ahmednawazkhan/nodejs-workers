const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('config');

const mongoConnectionURL = `mongodb://${config.get('mongoConfiguration.username')}:${config.get('mongoConfiguration.password')}@${config.get('mongoConfiguration.host')}:${config.get('mongoConfiguration.port')}?authSource=admin`;

async function createUsersConnection () {
    const client = new MongoClient(mongoConnectionURL, {useUnifiedTopology: true});
    await client.connect();
    const db = client.db(config.get('mongoConfiguration.database'));
    return db.collection('users');
}

module.exports = { createUsersConnection };