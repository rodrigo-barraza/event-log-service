'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const LikeController = require.main.require('./controllers/LikeController');
const RenderController = require.main.require('./controllers/RenderController');

const PostLike = () => {
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
            like: request.body('like'),
        }

        function verifyParameters() {
            const hasRequiredParameters = headers.ip && body.renderId && body.like;
            if (hasRequiredParameters) {
                EventEmitter.emit('validate-parameters');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        function validateParameters() {
            if (body.like !== 'true' && body.like !== 'false') {
                return response.sendError('Bad parameters.');
            } else {
                EventEmitter.emit('insert-like');
            }
        }

        async function insertLike() {
            try {
                const getRender = await RenderController.getRender(body.renderId)
                if (getRender.data) {
                    if (body.like === 'true') {
                        await LikeController.insertLike(body.renderId, headers)
                    } else {
                        await LikeController.deleteLike(body.renderId, headers.ip)
                    }
                    response.sendSuccessData('1')
                } else {
                    response.sendError('Error saving like')
                }
            } catch (err) {
                console.log(err)
            }
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('validate-parameters', validateParameters);
        EventEmitter.on('insert-like', insertLike);
        EventEmitter.emit('verify-parameters');
    }
};

module.exports = PostLike;