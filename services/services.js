'use strict';
const express = require('express');
const router = new express.Router();
const EventService = require('./EventService/EventService');

const routes = () => {
    EventService(router);
    return router;
};

module.exports = routes;