'use strict';
const RenderModel = require.main.require('./models/RenderModel');

const RenderController = {
    insertRender: (base64Image, prompt, samplerName, cfgScale, headers) => {
        const Render = new RenderModel();
        
        Render.ip = headers.ip;
        Render.local = headers.local;
        Render.userAgent = headers.userAgent
        Render.session = headers.session;
        Render.base64Image = base64Image;
        Render.prompt = prompt;
        Render.samplerName = samplerName;
        Render.cfgScale = cfgScale;

        return Render.save().then((result, error) => {
            return { result, error };
        });
    },
};

module.exports = RenderController;
