'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const RenderController = require.main.require('./controllers/RenderController');

const GetCount = () => {
    return (req, res) => {
        const EventEmitter = new EventsEventEmitter();
        const response = new ResponseClass(res);
        const request = new RequestClass(req);
        const headers = {
            ip: request.headers('x-forwarded-for') || request.connection('remoteAddress'),
            session: request.headers('session'),
            local: request.headers('local'),
        };

        function verifyParameters() {
            const hasRequiredParameters = headers.session;
            if (hasRequiredParameters) {
                EventEmitter.emit('getRenders');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        async function getRenders() {
            const countRenders = await RenderController.countRenders()
            if (countRenders.data) {
                const latestRendersObject = {
                    count: countRenders.data,
                }
                response.sendSuccessData(latestRendersObject)
            }
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('getRenders', getRenders);
        EventEmitter.emit('getRenders');
    }
};

module.exports = GetCount;