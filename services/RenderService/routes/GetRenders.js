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
            limit: request.query('limit'),
            mode: request.query('mode'), // 'random', 'latests', 'user'
        }

        function verifyParameters() {
            if (query.mode === 'user') {
                EventEmitter.emit('getRendersByIP');
            } else {
                EventEmitter.emit('getRandomRenders');
            }
        }

        async function getRandomRenders() {
            const getLatestRenders = await RenderController.getRandoms(query.limit)
            if (getLatestRenders.data) {
                const latestRendersObject = {
                    images: getLatestRenders.data,
                }
                response.sendSuccessData(latestRendersObject)
            }
        }

        async function getRendersByIP() {
            const getLatestRenders = await RenderController.getRenders(headers.ip)
            if (getLatestRenders.data) {
                const latestRendersObject = {
                    images: getLatestRenders.data,
                }
                response.sendSuccessData(latestRendersObject)
            }
        }

        EventEmitter.on('verifyParameters', verifyParameters);
        EventEmitter.on('getRandomRenders', getRandomRenders);
        EventEmitter.on('getRendersByIP', getRendersByIP);
        EventEmitter.emit('verifyParameters');
    }
};

module.exports = GetRenders;