'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const StableDiffusionApiLibrary = require.main.require('./libraries/StableDiffusionApiLibrary');

const GetStatus = () => {
    return (req, res) => {
        const EventEmitter = new EventsEventEmitter();
        const response = new ResponseClass(res);
        const request = new RequestClass(req);
        console.log(1)
        async function getStatus() {
            const { data, error, res } = await StableDiffusionApiLibrary.getProgress();
            console.log(data, error, res)
            if (data) {
                console.log(data)
                response.sendSuccessData(data)
            } else if (error) {
                response.sendError(error)
            }
        }

        EventEmitter.on('getStatus', getStatus);
        EventEmitter.emit('getStatus');
    }
};

module.exports = GetStatus;