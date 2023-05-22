const RenderService = (router) => {
    const resourceName = 'render-service';
    
    const postRender = require('./routes/PostRender')();
    router.post(`/${resourceName}/render`, postRender);

    const getRenders = require('./routes/GetRenders')();
    router.get(`/${resourceName}/renders`, getRenders);

    const getRender = require('./routes/GetRender')();
    router.get(`/${resourceName}/render`, getRender);

    const getCount = require('./routes/GetCount')();
    router.get(`/${resourceName}/count`, getCount);
};

module.exports = RenderService;
