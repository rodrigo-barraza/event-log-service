const GuestService = (router) => {
    const resourceName = 'guest-service';

    const getGuest = require('./routes/GetGuest')();
    router.get(`/${resourceName}/guest`, getGuest);
};

module.exports = GuestService;
