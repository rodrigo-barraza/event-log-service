const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SessionSchema = new Schema({
    ip: String,
    local: String,
    userAgent: String,
    session: String,
    duration: Number,
    width: Number,
    height: Number,

    versionKey: false,
},{
    collection: 'sessions',
    timestamps:{ createdAt: true, updatedAt: false }
});

const SessionModel = mongoose.model('SessionModel', SessionSchema);
module.exports = SessionModel;
