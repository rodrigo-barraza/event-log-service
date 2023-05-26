'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const RenderController = require.main.require('./controllers/RenderController');

const GetLikes = () => {
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
            limit: request.query('limit'),
        }

        function verifyParameters() {
            EventEmitter.emit('getRendersByIP');
        }

        async function getRendersByIP() {
            const getLikedRenders = await RenderController.getLikedRenders(headers.ip)
            if (getLikedRenders.data) {
                const latestRendersObject = {
                    images: getLikedRenders.data,
                }
                response.sendSuccessData(latestRendersObject)
            }
        }

        EventEmitter.on('verifyParameters', verifyParameters);
        EventEmitter.on('getRendersByIP', getRendersByIP);
        EventEmitter.emit('verifyParameters');
    }
};

module.exports = GetLikes;