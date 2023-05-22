'use strict';
const EventsEventEmitter = require('events').EventEmitter;
const ResponseClass = require.main.require('./classes/ResponseClass');
const RequestClass = require.main.require('./classes/RequestClass');
const RenderController = require.main.require('./controllers/RenderController');

const UpdateRenders = () => {
    return (req, res) => {
        const EventEmitter = new EventsEventEmitter();
        const response = new ResponseClass(res);

        async function getRender() {
            const getRender = await RenderController.updateRenders()
            response.sendSuccessData(getRender.data)
        }

        EventEmitter.on('getRender', getRender);
        EventEmitter.emit('getRender');
    }
};

module.exports = UpdateRenders;