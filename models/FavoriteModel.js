const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FavoriteSchema = new Schema({
    local: String,
    session: String,
    ip: String,
    renderIds: {
        type: Map,
        of: Boolean,
        default: {}
    },
    versionKey: false,
},{
    collection: 'favorites',
    timestamps:{ createdAt: true, updatedAt: false }
});

const FavoriteModel = mongoose.model('FavoriteModel', FavoriteSchema);
module.exports = FavoriteModel;