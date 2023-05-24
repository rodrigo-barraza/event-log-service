'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const RenderController = require.main.require('./controllers/RenderController');
const AWSWrapper = require.main.require('./wrappers/AWSWrapper');
const StyleCollection = require.main.require('./collections/StyleCollection');

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
            negative_prompt: request.body('negativePrompt'),
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
            try {
                let fullPrompt = body.prompt;
                let fullNegativePrompt = body.negative_prompt;

                const stylePrompt = body.style ? StyleCollection.find(style => style.value === body.style) : '';
                if (stylePrompt.prompt) {
                    fullPrompt = ` ${stylePrompt.prompt}, ${body.prompt}`;
                }
                if (stylePrompt.negativePrompt) {
                    fullNegativePrompt = `${stylePrompt.negativePrompt}, ${body.negative_prompt}`;
                }

                const myHeaders = new Headers({
                    'Content-Type': 'application/json'
                })
                const requestBody = {
                    prompt: fullPrompt,
                    negative_prompt: fullNegativePrompt,
                    steps: 20,
                    batch_size: 1,
                    width: 768,
                    height: 768,
                    sampler_name: body.sampler,
                    cfg_scale: body.cfg,
                };
                const stringifiedRequestBody = JSON.stringify(requestBody);
                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: stringifiedRequestBody,
                    redirect: 'follow'
                };
                const postTxt2ImgResponse = await fetch(`${process.env.RENDER_API}/sdapi/v1/txt2img`, requestOptions)
                const postTxt2ImgResult = await postTxt2ImgResponse.text()
                const parsedPostTxt2ImgResult = JSON.parse(postTxt2ImgResult)
                parsedPostTxt2ImgResult.info = JSON.parse(parsedPostTxt2ImgResult.info)
                EventEmitter.emit('insertRender', parsedPostTxt2ImgResult.images[0]);
            } catch (error) {
                response.sendError(error)
            }
        }

        async function insertRender(base64Image) {
            try {
                let countRenders = await RenderController.countRenders()
                const count = countRenders.data + 1;
                let imageUrl = await AWSWrapper.imageUploadBase64(base64Image)
                let insertRender = await RenderController.insertRender(
                    imageUrl.replace('s3.us-west-2.amazonaws.com/', '').replace('generations.rod.dev', 'renders.rod.dev'),
                    count, 
                    body.prompt, 
                    body.negative_prompt, 
                    body.sampler, 
                    body.cfg, 
                    body.style, 
                    headers)
                const renderResponse = {
                    // image: base64Image,
                    image: insertRender.data.image,
                    style: insertRender.data.style,
                    cfg: insertRender.data.cfg,
                    prompt: insertRender.data.prompt,
                    sampler: insertRender.data.sampler,
                    createdAt: insertRender.data.createdAt,
                    count: count,
                    id: insertRender.data.id
                }
                response.sendSuccessData(renderResponse)
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