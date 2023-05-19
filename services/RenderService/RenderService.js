const RenderService = (router) => {
    const resourceName = 'render-service';
    const postRender = require('./routes/PostRender')();
    const getRenders = require('./routes/GetRenders')();
    const getRandom = require('./routes/GetRandom')();
    // const getStatus = require('./routes/GetStatus')();

    router.post(`/${resourceName}/render`, postRender);
    router.get(`/${resourceName}/renders`, getRenders);
    router.get(`/${resourceName}/random`, getRandom);
    // router.get(`/${resourceName}/status`, getStatus);
};

module.exports = RenderService;
