const { nanoid } = require('nanoid');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RenderSchema = new Schema({
    local: String,
    session: String,
    image: String,
    prompt: String,
    negativePrompt: String,
    sampler: String,
    cfg: Number,
    style: String,
    count: Number,
    id: {
        type: String,
        default: () => {
            return nanoid(11)
        }
    },
    ip: String,
    versionKey: false,
},{
    collection: 'renders',
    timestamps:{ createdAt: true, updatedAt: false }
});

RenderSchema.statics.random = async function() {
    const count = await this.count();
    const rand = Math.floor(Math.random() * count);
    const randomDoc = await this.findOne().skip(rand);
    return randomDoc;
};

const RenderModel = mongoose.model('RenderModel', RenderSchema);
module.exports = RenderModel;