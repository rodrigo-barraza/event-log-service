'use strict';
const JournalModel = require.main.require('./models/JournalModel');

const JournalController = {
    getJournal: async (headers) => {
        let data, error, response;
        try {
            response = await JournalModel.find({}).sort({
                date: -1
            });
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    insertJournal: async (day, exercise, reps, weight, unit, headers) => {
        let data, error, response;
        try {
            const Journal = new JournalModel();
            Journal.ip = headers.ip;
            Journal.local = headers.local;
            Journal.userAgent = headers.userAgent
            Journal.session = headers.session;

            Journal.day = day;
            Journal.exercise = exercise;
            Journal.reps = reps;
            Journal.weight = weight;
            Journal.unit = unit;

            response = await Journal.save()
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    }
};

module.exports = JournalController;