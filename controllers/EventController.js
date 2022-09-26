'use strict';
const EventModel = require.main.require('./models/EventModel');
const SessionModel = require.main.require('./models/SessionModel');

const EventController = {
    insertEvent: (category, action, label, value, headers) => {
        const Event = new EventModel();
        
        Event.ip = headers.ip;
        Event.local = headers.local;
        Event.userAgent = headers.userAgent
        Event.session = headers.session;

        Event.category = category;
        Event.action = action;
        Event.label = label;
        Event.value = value;

        return Event.save().then((result, error) => {
            return { result, error };
        });
    },
    insertSession: (duration, width, height, headers) => {
        return SessionModel.findOneAndUpdate(
            { session: headers.session },
            { $inc:{ duration: duration },
            $set:{ 
                userAgent: headers.userAgent,
                local: headers.local,
                ip: headers.ip,
                width: width,
                height: height,
            }}, {
                new: true,
                upsert: true, }
        ).then((result, error) => {
            return { result, error };
        });
    },
};

module.exports = EventController;
