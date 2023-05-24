'use strict';
const RenderModel = require.main.require('./models/RenderModel');
const { nanoid } = require('nanoid');

const RenderController = {
    insertRender: async (image, count, prompt, negativePrompt, sampler, cfg, style, headers) => {    
        let data, error, response;
        try {
            const Render = new RenderModel();
            Render.ip = headers.ip;
            Render.local = headers.local;
            Render.userAgent = headers.userAgent
            Render.session = headers.session;
            Render.image = image;
            Render.prompt = prompt;
            Render.negativePrompt = negativePrompt;
            Render.sampler = sampler;
            Render.cfg = cfg;
            Render.style = style;
            Render.count = count;

            response = await Render.save()
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    countRenders: async () => {
        let data, error, response;
        try {
            response = await RenderModel.countDocuments({})
            if (response || response === 0) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    getLatestRenders: async (limit = 1) => {
        let data, error, response;
        try {
            response = await RenderModel.find({}).sort({ _id: -1 }).limit(limit)
            if (response.length) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    getRender: async (limit = 1) => {
        let data, error, response;
        try {
            response = await RenderModel.find({}).sort({ _id: -1 }).limit(limit)
            if (response.length) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    getRenderByCountId: async (countField) => {
        let data, error, response;
        try {
            response = await RenderModel.findOne({ count: Number(countField) })
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    getRenderById: async (id) => {
        let data, error, response;
        try {
            response = await RenderModel.findOne({ id: id })
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    getRandom: async () => {
        let data, error, response;
        try {
            response = await RenderModel.random()
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    getRandoms: async (limit = 1) => {
        let data, error, response;
        let sizeLimit = limit <= 12 ? limit : 12;
        try {
            response = await RenderModel.aggregate([{
                $sample: {
                    size: Number(sizeLimit)
                }
            }]);
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    updateRenders: async () => {
        let data, error, response;
        try {
            response = await RenderModel.find({});
            response.forEach((render) => {
                render.deleted = false;
                // render.image = render.image.replace('https://generations.rod.dev/', 'https://renders.rod.dev/')
                // render.id = nanoid(11);
                render.save();
            });
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    getRendersByIP: async (ip) => {
        let data, error, response;
        try {
            response = await RenderModel.find({ ip: ip, deleted: { $ne: true} }).sort({ _id: -1 });
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    deleteRender: async (id, ip) => {
        let data, error, response;
        try {
            response = await RenderModel.findOneAndUpdate(
                { ip: ip, id: id }, 
                { deleted: true })
            console.log(response)
            if (response) {
                data = response
            } else {
                error = { message: 'Render not found' }
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },

};

module.exports = RenderController;
