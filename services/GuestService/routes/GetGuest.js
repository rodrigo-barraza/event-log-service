'use strict';

const { get } = require('http');

const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const LikeController = require.main.require('./controllers/LikeController');

const GetGuest = () => {
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
            const hasRequiredParameters = headers.ip;
            if (hasRequiredParameters) {
                EventEmitter.emit('getHasLikes');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        async function getHasLikes() {
            const getHasLikes = await LikeController.getHasLikes(headers.ip)
            const guest = {
                likes: 0
            }
            if (getHasLikes?.data) {
                guest.likes = getHasLikes.data;
            }
            response.sendSuccessData(guest)
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('getHasLikes', getHasLikes);
        EventEmitter.emit('verify-parameters');
    }
};

module.exports = GetGuest;