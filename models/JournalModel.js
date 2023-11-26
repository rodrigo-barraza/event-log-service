const { nanoid } = require('nanoid');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JournalSchema = new Schema({
    ip: String,
    local: String,
    session: String,
    id: {
        type: String,
        default: () => {
            return nanoid(11)
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    
    exercise: String,
    reps: Number,
    weight: Number,
    unit: String,
    style: String,
    stance: String,
    equipment: String,
    position: String,
    
    versionKey: false,
},{
    collection: 'journal',
    timestamps:{ createdAt: true, updatedAt: false }
});

const JournalModel = mongoose.model('JournalModel', JournalSchema);
module.exports = JournalModel;