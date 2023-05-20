'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const RenderController = require.main.require('./controllers/RenderController');

const GetRandom = () => {
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
                EventEmitter.emit('getRandom');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        async function getRandom() {
            const getRandom = await RenderController.getRandom()
            if (getRandom.data) {
                const latestRendersObject = {
                    image: getRandom.data.image,
                    style: getRandom.data.style,
                    cfg: getRandom.data.cfg,
                    prompt: getRandom.data.prompt,
                    sampler: getRandom.data.sampler,
                    createdAt: getRandom.data.createdAt,
                    count: getRandom.data.count
                }
                response.sendSuccessData(latestRendersObject)
            }
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('getRandom', getRandom);
        EventEmitter.emit('getRandom');
    }
};

module.exports = GetRandom;