const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EventSchema = new Schema({
    local: String,
    session: String,
    category: String,
    action: String,
    label: String,
    value: String,
    ip: String,
    versionKey: false,
},{
    collection: 'events',
    timestamps:{ createdAt: true, updatedAt: false }
});

const EventModel = mongoose.model('EventModel', EventSchema);
module.exports = EventModel;
