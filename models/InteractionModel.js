const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const InteractionSchema = new Schema({
    asset: String,
    viewCount: Number,
    totalViewLength: Number,
    averageViewLength: Number,
    starRating: Number,
    starRatingCount: Number,
    versionKey: false,
},{
    collection: 'sessions',
    timestamps:{ createdAt: true, updatedAt: false }
});

const InteractionModel = mongoose.model('InteractionModel', InteractionSchema);
module.exports = InteractionModel;
