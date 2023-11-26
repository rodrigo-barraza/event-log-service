'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const JournalController = require.main.require('./controllers/JournalController');

const PostJournal = () => {
    return (req, res) => {
        console.log('PostJournal');
        const EventEmitter = new EventsEventEmitter();
        const response = new ResponseClass(res);
        const request = new RequestClass(req);
        const headers = {
            ip: request.headers('x-forwarded-for') || request.connection('remoteAddress'),
            session: request.headers('session'),
            local: request.headers('local'),
        };

        const body = {
            exercise: request.body('exercise'),
            reps: request.body('reps'),
            weight: request.body('weight'),
            unit: request.body('unit'),
            style: request.body('style'),
            stance: request.body('stance'),
            equipment: request.body('equipment'),
            position: request.body('position'),
        }

        console.log(body)

        function verifyParameters() {
            const hasRequiredParameters = headers.ip
            && body.exercise
            && body.reps && body.weight && body.unit;
            if (hasRequiredParameters) {
                EventEmitter.emit('insertJournal');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        async function insertJournal() {
            try {
                let insertJournal = await JournalController.insertJournal(
                    headers,
                    body.exercise,
                    body.reps,
                    body.weight,
                    body.unit,
                    body.style,
                    body.stance,
                    body.equipment,
                    body.position)
                response.sendSuccessData(insertJournal.data)
            } catch (err) {
                response.sendError(error)
            }
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('insertJournal', insertJournal);
        EventEmitter.emit('verify-parameters');
    }
};

module.exports = PostJournal;