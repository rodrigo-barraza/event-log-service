'use strict';
const express = require('express');
const router = new express.Router();
const EventService = require('./EventService/EventService');
const RenderService = require('./RenderService/RenderService');
const HealthCheckService = require('./HealthCheckService/HealthCheckService');

const routes = () => {
    EventService(router);
    RenderService(router);
    HealthCheckService(router);
    return router;
};

module.exports = routes;