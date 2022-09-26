'use strict';
const express = require('express');
const router = new express.Router();
const EventService = require('./EventService/EventService');
const HealthCheckService = require('./HealthCheckService/HealthCheckService');

const routes = () => {
    EventService(router);
    HealthCheckService(router);
    return router;
};

module.exports = routes;