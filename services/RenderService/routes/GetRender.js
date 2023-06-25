'use strict';
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
                const getRender = await RenderController.getRenderById(query.id, headers.ip)
                if (getRender.data) {
                    const renderObject = RenderController.createRenderObject(getRender.data);
                    response.sendSuccessData(renderObject)
                } else {
                    response.sendError('No render found.')
                }
            } else {
                const getRandom = await RenderController.getRandomWithLikes(query.id, headers.ip)
                if (getRandom.data) {
                    const renderObject = RenderController.createRenderObject(getRandom.data);
                    response.sendSuccessData(renderObject)
                }
            }
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('getRender', getRender);
        EventEmitter.emit('getRender');
    }
};

module.exports = GetRender;