const EventService = (router) => {
    const resourceName = 'event-service';
    const postEvent = require('./routes/postEvent')();
    const postSession = require('./routes/postSession')();

    router.post(`/${resourceName}/event`, postEvent);
    router.post(`/${resourceName}/session`, postSession);
};

module.exports = EventService;
