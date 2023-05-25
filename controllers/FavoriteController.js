'use strict';
const FavoriteModel = require.main.require('./models/FavoriteModel');

const FavoriteController = {
    insertFavorite: async (renderId, headers) => {
        let data, error, response;
        try {
            const query = {ip: headers.ip};
            const update = {};
            const options = {upsert: true, new: true, setDefaultsOnInsert: true};
            const Favorite = await FavoriteModel.findOneAndUpdate(query, update, options);
            Favorite.local = headers.local;
            Favorite.session = headers.session;
            Favorite.ip = headers.ip;
            Favorite.renderIds.set(renderId, true);
            response = await Favorite.save()
            if (response) {
                data = response
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    getFavorites: async (ip) => {
        let data, error, response;
        try {
            const query = {ip: ip};
            const Favorite = await FavoriteModel.findOne(query)
            if (Favorite) {
                data = Favorite
            } else {
                error = { message: 'Favorite not found' }
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    deleteFavorite: async (renderId, ip) => {
        let data, error, response;
        try {
            const query = {ip: ip};
            const Favorite = await FavoriteModel.findOne(query)
            Favorite.renderIds.set(renderId, false);
            response = await Favorite.save()
            if (response) {
                data = response
            } else {
                error = { message: 'Favorite not found' }
            }
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
};

module.exports = FavoriteController;
