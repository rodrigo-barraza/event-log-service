'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const RenderController = require.main.require('./controllers/RenderController');
const AWSWrapper = require.main.require('./wrappers/AWSWrapper');
const StyleCollection = require.main.require('./collections/StyleCollection');
const StableDiffusionApiLibrary = require.main.require('./libraries/StableDiffusionApiLibrary');

const PostRender = () => {
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
            prompt: request.body('prompt'),
            sampler: request.body('sampler'),
            cfg: request.body('cfg'),
            style: request.body('style'),
            negativePrompt: request.body('negativePrompt'),
            aspectRatio: request.body('aspectRatio')
        }

        function verifyParameters() {
            const hasRequiredParameters = headers.ip && body.prompt;
            if (hasRequiredParameters) {
                EventEmitter.emit('postRender');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }
        async function postRender() {
            const { data, error, res } = await StableDiffusionApiLibrary.postTxt2Img(body.prompt, body.negativePrompt, body.sampler, body.cfg, body.style, body.aspectRatio);
            if (data) {
                EventEmitter.emit('insertRender', data.images[0]);
            } else if (error) {
                response.sendError(error)
            }
        }

        async function insertRender(base64Image) {
            try {
                let countRenders = await RenderController.countRenders()
                const count = countRenders.data + 1;
                let { id, image, thumbnail } = await AWSWrapper.uploadImage(base64Image)
                let insertRender = await RenderController.insertRender(
                    id,
                    image,
                    thumbnail,
                    count, 
                    body.prompt, 
                    body.negativePrompt, 
                    body.sampler, 
                    body.cfg, 
                    body.style, 
                    body.aspectRatio, 
                    headers)
                const renderObject = RenderController.createRenderObject(insertRender.data);
                response.sendSuccessData(renderObject)
            } catch (err) {
                console.log(err)
            }
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('postRender', postRender);
        EventEmitter.on('insertRender', insertRender);
        EventEmitter.emit('verify-parameters');
    }
};

module.exports = PostRender;