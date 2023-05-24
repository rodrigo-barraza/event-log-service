'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const FavoriteController = require.main.require('./controllers/FavoriteController');
const RenderController = require.main.require('./controllers/RenderController');

const PostFavorite = () => {
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
            renderId: request.body('renderId'),
        }

        function verifyParameters() {
            const hasRequiredParameters = headers.ip && body.renderId;
            if (hasRequiredParameters) {
                EventEmitter.emit('insertFavorite');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        async function insertFavorite() {
            try {
                const getRender = await RenderController.getRender(body.renderId)
                if (getRender.data) {
                    const insertFavorite = await FavoriteController.insertFavorite(body.renderId, headers)
                    response.sendSuccessData('1')
                } else {
                    response.sendError('Error saving favorite')
                }
            } catch (err) {
                console.log(err)
            }
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('insertFavorite', insertFavorite);
        EventEmitter.emit('verify-parameters');
    }
};

module.exports = PostFavorite;