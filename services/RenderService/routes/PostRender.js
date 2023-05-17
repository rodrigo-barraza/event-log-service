'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');

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
            sampler_name: request.body('sampler'),
            cfg_scale: request.body('cfg'),
            negative_prompt: request.body('negativePrompt'),
        }

        function verifyParameters() {
            const hasRequiredParameters = headers.session && body.prompt;
            if (hasRequiredParameters) {
                EventEmitter.emit('postRender');
            } else {
                return response.sendError('Missing required parameters.');
            }
        }

        async function postRender() {
            const myHeaders = new Headers({
                'Content-Type': 'application/json'
            })
            const requestBody = JSON.stringify({
                prompt: body.prompt,
                // negative_prompt: "ugly, disfigured, deformed, anime, illustration, drawing",
                steps: 20,
                batch_size: 1,
                width: 768,
                height: 768,
                sampler_name: body.sampler_name,
                cfg_scale: body.cfg_scale,
            });
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: requestBody,
                redirect: 'follow'
            };

            // const res = await fetch("https://render.digestem.com/sdapi/v1/txt2img", requestOptions);
            // if (res.status === 200) {
            //     const result = await res.text()
            //     return response.sendSuccessData(JSON.parse(result));
            // }
            await fetch(`${process.env.RENDER_API}/sdapi/v1/txt2img`, requestOptions)
            .then(response => response.text())
            .then(result => {
                const parsedResult = JSON.parse(result)
                parsedResult.info = JSON.parse(parsedResult.info)
                response.sendSuccessData(parsedResult.images[0])
            })
            .catch(error => response.sendError(error));
        }

        EventEmitter.on('verify-parameters', verifyParameters);
        EventEmitter.on('postRender', postRender);
        EventEmitter.emit('verify-parameters');
    }
};

module.exports = PostRender;