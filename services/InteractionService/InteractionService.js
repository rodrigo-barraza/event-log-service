const InteractionService = (router) => {
    const resourceName = 'interaction-service';
    const postInteraction = require('./routes/postInteraction')();

    router.post(`/${resourceName}/interaction`, postInteraction);
};

module.exports = InteractionService;
