const EventService = (router) => {
    const resourceName = 'session-service';
    const postEvent = require('./routes/PostEvent')();
    const postSession = require('./routes/PostSession')();

    router.post(`/${resourceName}/event`, postEvent);
    router.post(`/${resourceName}/session`, postSession);
};

module.exports = EventService;
