const HealthCheckService = (router) => {
    const GetHeartbeat = require('./routes/GetHeartbeat')();
    const resourceName = 'health-check-service';

    router.get(`/${resourceName}/heartbeat`, GetHeartbeat);
};

module.exports = HealthCheckService;
