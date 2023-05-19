const RenderService = (router) => {
    const resourceName = 'render-service';
    const postRender = require('./routes/PostRender')();
    const getRenders = require('./routes/GetRenders')();
    const getRender = require('./routes/GetRender')();
    router.post(`/${resourceName}/render`, postRender);
    router.get(`/${resourceName}/renders`, getRenders);
    router.get(`/${resourceName}/render`, getRender);
};

module.exports = RenderService;
