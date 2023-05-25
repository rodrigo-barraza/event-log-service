'use strict';

const { get } = require('http');

const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const RenderController = require.main.require('./controllers/RenderController');

const GetRender = () => {
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
            id: request.query('id')
        }

        function verifyParameters() {
            const hasRequiredParameters = headers.session;
            if (hasRequiredParameters) {
                EventEmitter.emit('getRender');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        async function getRender() {
            if (query.id) {
                const getRender = await RenderController.getRenderById(query.id)
                if (getRender?.data) {
                    const latestRendersObject = {
                        image: getRender.data.image,
                        style: getRender.data.style,
                        cfg: getRender.data.cfg,
                        prompt: getRender.data.prompt,
                        sampler: getRender.data.sampler,
                        createdAt: getRender.data.createdAt,
                        count: getRender.data.count,
                        id: getRender.data.id,
                        like: getRender.data.like,
                    }
                    response.sendSuccessData(latestRendersObject)
                } else {
                    response.sendError('No render found.')
                }
            } else {
                const getRandom = await RenderController.getRandom()
                if (getRandom.data) {
                    const latestRendersObject = {
                        image: getRandom.data.image,
                        style: getRandom.data.style,
                        cfg: getRandom.data.cfg,
                        prompt: getRandom.data.prompt,
                        sampler: getRandom.data.sampler,
                        createdAt: getRandom.data.createdAt,
                        count: getRandom.data.count,
                        id: getRandom.data.id,
                        like: getRandom.data.like,
                    }
                    response.sendSuccessData(latestRendersObject)
                }
            }
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('getRender', getRender);
        EventEmitter.emit('getRender');
    }
};

module.exports = GetRender;