const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RenderSchema = new Schema({
    local: String,
    session: String,
    base64Image: String,
    prompt: String,
    samplerName: String,
    cfgScale: Number,
    ip: String,
    versionKey: false,
},{
    collection: 'renders',
    timestamps:{ createdAt: true, updatedAt: false }
});

const RenderModel = mongoose.model('RenderModel', RenderSchema);
module.exports = RenderModel;
