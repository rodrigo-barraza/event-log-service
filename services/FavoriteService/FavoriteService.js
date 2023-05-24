const FavoriteService = (router) => {
    const resourceName = 'favorite-service';
    
    const postFavorite = require('./routes/PostFavorite')();
    router.post(`/${resourceName}/favorite`, postFavorite);

    const deleteFavorite = require('./routes/DeleteFavorite')();
    router.delete(`/${resourceName}/favorite`, deleteFavorite);
};

module.exports = FavoriteService;
