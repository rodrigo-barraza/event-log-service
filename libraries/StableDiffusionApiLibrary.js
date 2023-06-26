'use strict';
const UtilityLibrary = require.main.require('./libraries/UtilityLibrary');

const EventApiLibrary = {
    RENDER_API: process.env.RENDER_API,
    SDAPI_TXT2IMG: '/sdapi/v1/txt2img',
    SDAPI_PROGRESS: '/sdapi/v1/progress',
    async postTxt2Img(prompt, negativePrompt, sampler, cfg, style, aspectRatio) {
        let data, error, response;
        try {
            const {generatedPrompt, generatedNegativePrompt} = UtilityLibrary.generatePrompts(prompt, negativePrompt, style);
            const {width, height} = UtilityLibrary.generateDimensions(aspectRatio);

            const requestBody = {
                prompt: generatedPrompt,
                negative_prompt: generatedNegativePrompt,
                steps: 25,
                batch_size: 1,
                width: width,
                height: height,
                sampler_name: sampler,
                cfg_scale: cfg,
            };
            
            const stringifiedRequestBody = JSON.stringify(requestBody);
            const myHeaders = new Headers({
                'Content-Type': 'application/json'
            })
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: stringifiedRequestBody,
                redirect: 'follow'
            };
            response = await fetch(`${this.RENDER_API}${this.SDAPI_TXT2IMG}`, requestOptions)
            if (response.ok) {
                const postTxt2ImgResult = await response.text()
                const parsedPostTxt2ImgResult = JSON.parse(postTxt2ImgResult)
                parsedPostTxt2ImgResult.info = JSON.parse(parsedPostTxt2ImgResult.info)
                data = parsedPostTxt2ImgResult;
            } else {
                error = response;
            }
        } catch (error) {
            error = error
        }
        console.log(data, error, response)
        return {data, error, response}
    },
    async getProgress() {
        let data, error, response;
        try {
            const myHeaders = new Headers({
                'Content-Type': 'application/json'
            })
            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            response = await fetch(`${this.RENDER_API}${this.SDAPI_PROGRESS}`, requestOptions)
            console.log(response.ok)
            if (response.ok) {
                const postTxt2ImgResult = await response.text()
                const parsedPostTxt2ImgResult = JSON.parse(postTxt2ImgResult)
                data = parsedPostTxt2ImgResult;
            } else {
                error = response;
            }
        } catch (error) {
            error = error
        }
        return {data, error, response}
    }
};

module.exports = EventApiLibrary;
