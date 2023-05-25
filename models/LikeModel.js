const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LikeSchema = new Schema({
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
    collection: 'likes',
    timestamps:{ createdAt: true, updatedAt: false }
});

const LikeModel = mongoose.model('LikeModel', LikeSchema);
module.exports = LikeModel;