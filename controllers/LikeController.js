'use strict';
const LikeModel = require.main.require('./models/LikeModel');

const LikeController = {
    insertLike: async (renderId, headers) => {
        let data, error, response;
        try {
            const query = {ip: headers.ip};
            const update = {};
            const options = {upsert: true, new: true, setDefaultsOnInsert: true};
            const Like = await LikeModel.findOneAndUpdate(query, update, options);
            Like.local = headers.local;
            Like.session = headers.session;
            Like.ip = headers.ip;
            Like.renderIds.set(renderId, true);
            response = await Like.save()
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    getLikes: async (ip) => {
        let data, error, response;
        try {
            const query = {ip: ip};
            const Like = await LikeModel.findOne(query)
            if (Like) {
                data = Like
            } else {
                error = { message: 'Like not found' }
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    deleteLike: async (renderId, ip) => {
        let data, error, response;
        try {
            const query = {ip: ip};
            const Like = await LikeModel.findOne(query)
            Like.renderIds.set(renderId, false);
            response = await Like.save()
            if (response) {
                data = response
            } else {
                error = { message: 'Like not found' }
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
};

module.exports = LikeController;
