const RenderService = (router) => {
    const resourceName = 'render-service';
    const postRender = require('./routes/PostRender')();
    // const getStatus = require('./routes/GetStatus')();

    router.post(`/${resourceName}/render`, postRender);
    // router.get(`/${resourceName}/status`, getStatus);
};

module.exports = RenderService;
