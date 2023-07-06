'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const JournalController = require.main.require('./controllers/JournalController');

const GetJournal = () => {
    return (req, res) => {
        const EventEmitter = new EventsEventEmitter();
        const response = new ResponseClass(res);
        const request = new RequestClass(req);
        const headers = {
            ip: request.headers('x-forwarded-for') || request.connection('remoteAddress'),
            session: request.headers('session'),
            local: request.headers('local'),
        };

        const body = {
        }

        function verifyParameters() {
            const hasRequiredParameters = headers.ip;
            if (hasRequiredParameters) {
                EventEmitter.emit('getJournal');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        async function getJournal() {
            try {
                let getJournal = await JournalController.getJournal(
                    body.day,
                    body.exercise,
                    body.reps,
                    body.weight,
                    body.unit,
                    headers)
                response.sendSuccessData(getJournal.data)
            } catch (err) {
                response.sendError(error)
            }
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('getJournal', getJournal);
        EventEmitter.emit('verify-parameters');
    }
};

module.exports = GetJournal;