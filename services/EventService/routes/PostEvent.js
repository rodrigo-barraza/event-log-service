'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const EventController = require.main.require('./controllers/EventController');

const PostEvent = () => {
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
            category: request.body('category'),
            action: request.body('action'),
            label: request.body('label'),
            value: request.body('value'),
        }

        function verifyParameters() {
            const hasRequiredParameters = headers.session && body.category && body.action;
            if (hasRequiredParameters) {
                EventEmitter.emit('insertEvent');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        function insertEvent() {
            EventController.insertEvent(body.category, body.action, body.label, body.value, headers)
            .then((eventResponse, responseError) => {
                return response.sendSuccessMessage('');
            });
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('insertEvent', insertEvent);
        EventEmitter.emit('verify-parameters');
    }
};

module.exports = PostEvent;