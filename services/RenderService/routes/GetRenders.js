'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const RenderController = require.main.require('./controllers/RenderController');

const GetRenders = () => {
    return (req, res) => {
        const EventEmitter = new EventsEventEmitter();
        const response = new ResponseClass(res);
        const request = new RequestClass(req);
        const headers = {
            ip: request.headers('x-forwarded-for') || request.connection('remoteAddress'),
            session: request.headers('session'),
            local: request.headers('local'),
        };
        const query = {
            limit: request.query('limit')
        }

        function verifyParameters() {
            const hasRequiredParameters = headers.session;
            if (hasRequiredParameters) {
                EventEmitter.emit('getRenders');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        async function getRenders() {
            const { data } = await RenderController.getLatestRenders(query.limit)
            if (data) {
                const latestRendersObject = {
                    images: data,
                }
                response.sendSuccessData(latestRendersObject)
            }
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('getRenders', getRenders);
        EventEmitter.emit('verify-parameters');
    }
};

module.exports = GetRenders;