const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('config');

const mongoConnectionURL = `mongodb://${config.get('mongoConfiguration.username')}:${config.get('mongoConfiguration.password')}@${config.get('mongoConfiguration.host')}:${config.get('mongoConfiguration.port')}?authSource=admin`;

async function createUsersConnection () {
    const client = await createMongoClient();
    const db = client.db(config.get('mongoConfiguration.database'));
    return db.collection('users');
}

async function createMongoClient() {
    const client = new MongoClient(mongoConnectionURL, {useUnifiedTopology: true});
    return client.connect();
}



module.exports = { createUsersConnection, createMongoClient };