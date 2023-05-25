const LikeService = (router) => {
    const resourceName = 'like-service';
    
    const postLike = require('./routes/PostLike')();
    router.post(`/${resourceName}/like`, postLike);
};

module.exports = LikeService;
