const RenderService = (router) => {
    const resourceName = 'render-service';

    const getRender = require('./routes/GetRender')();
    router.get(`/${resourceName}/render`, getRender);
    
    const postRender = require('./routes/PostRender')();
    router.post(`/${resourceName}/render`, postRender);

    const deleteRender = require('./routes/DeleteRender')();
    router.delete(`/${resourceName}/render`, deleteRender);

    const getRenders = require('./routes/GetRenders')();
    router.get(`/${resourceName}/renders`, getRenders);

    const getCount = require('./routes/GetCount')();
    router.get(`/${resourceName}/count`, getCount);

    // const updateRenders = require('./routes/UpdateRenders')();
    // router.patch(`/${resourceName}/renders`, updateRenders);
};

module.exports = RenderService;
