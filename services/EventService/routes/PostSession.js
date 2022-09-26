'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const EventController = require.main.require('./controllers/EventController');

const PostSession = () => {
    return (req, res) => {
        const EventEmitter = new EventsEventEmitter();
        const response = new ResponseClass(res);
        const request = new RequestClass(req);
        const headers = {
            ip: request.headers('x-real-ip') || request.connection('remoteAddress'),
            session: request.headers('session'),
            local: request.headers('local'),
            userAgent: request.headers('user-agent'),
        };
        const body = {
            duration: request.body('duration'),
            width: request.body('width'),
            height: request.body('height'),
        }
        
        function verifyParameters() {
            const hasRequiredParameters = headers.session && body.duration;
            if (hasRequiredParameters) {
                EventEmitter.emit('insertSession');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        function insertSession() {
            EventController.insertSession(body.duration, body.width, body.height, headers)
            .then((eventResponse, responseError) => {
                return response.sendSuccessMessage('');
            });
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('insertSession', insertSession);
        EventEmitter.emit('verify-parameters');
    }
};

module.exports = PostSession;