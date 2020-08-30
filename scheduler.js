const { createMongoClient } = require("./db/db");
const { getUserCategories } = require("./workers");
const express = require('express');
const Agendash = require('agendash');
const Agenda = require('agenda');

async function createScheduler(usersCollection) {
    const agenda = new Agenda({ mongo: (await createMongoClient()).db('agenda-test') });
    agenda.define('get users categories', async job => {
        const startTime = Date.now()
        job.attrs.data = await getUserCategories(usersCollection);
        job.attrs.data.timeTakenInMilliseconds = Date.now() - startTime;
    });

    return agenda;
}

async function startScheduler(agenda) {
    await agenda.start();

    await agenda.every('1 minute', 'get users categories');

    const app = express();
    app.use('/', Agendash(agenda, {
        title: "Job Scheduler"
    }));
    console.log("started server at port 3000")
    app.listen(3000)
}

module.exports = { createScheduler, startScheduler };