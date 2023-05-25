'use strict';
const express = require('express');
const router = new express.Router();
const EventService = require('./EventService/EventService');
const FavoriteService = require('./FavoriteService/FavoriteService');
const LikeService = require('./LikeService/LikeService');
const RenderService = require('./RenderService/RenderService');
const HealthCheckService = require('./HealthCheckService/HealthCheckService');

const routes = () => {
    EventService(router);
    RenderService(router);
    FavoriteService(router);
    LikeService(router);
    HealthCheckService(router);
    return router;
};

module.exports = routes;