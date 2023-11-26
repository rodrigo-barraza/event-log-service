'use strict';
const JournalModel = require.main.require('./models/JournalModel');

const JournalController = {
    getJournal: async () => {
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
    insertJournal: async (headers, exercise, reps, weight, unit, style, stance, equipment, position) => {
        let data, error, response;
        try {
            const Journal = new JournalModel();
            Journal.ip = headers.ip;
            Journal.local = headers.local;
            Journal.userAgent = headers.userAgent
            Journal.session = headers.session;

            Journal.exercise = exercise;
            Journal.reps = reps;
            Journal.weight = weight;
            Journal.unit = unit;
            Journal.style = style;
            Journal.stance = stance;
            Journal.equipment = equipment;
            Journal.position = position;


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