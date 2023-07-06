const GymService = (router) => {
    const resourceName = 'gym-service';

    const postJournal = require('./routes/PostJournal')();
    router.post(`/${resourceName}/journal`, postJournal);

    
    const getJournal = require('./routes/GetJournal')();
    router.get(`/${resourceName}/journal`, getJournal);
};

module.exports = GymService;
