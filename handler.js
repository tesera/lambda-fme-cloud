'use strict';

const FMECloudAPI = require('fme-cloud-api');

module.exports.start = (event, context, callback) => {
    if(event.FMEInstanceID) {
        var client = new FMECloudAPI(process.env.TOKEN);
        client.start(event.FMEInstanceID);
        callback(null, {
            message: 'lambda-fme-cloud (start) called successfully!',
            FMEInstanceID: event.FMEInstanceID,
            started: true,
            event
        });
    } else {
        callback({
            message: 'Missing FMEInstanceID',
            event
        });
    }
};

module.exports.pause = (event, context, callback) => {
    if(event.FMEInstanceID) {
        var client = new FMECloudAPI(process.env.TOKEN);
        client.pause(event.FMEInstanceID).then(() => {
            callback(null, {
                message: 'lambda-fme-cloud (pause) called successfully!',
                FMEInstanceID: event.FMEInstanceID,
                paused: true,
                event
            });
        }).catch(console.error);
    } else {
        callback({
            message: 'Missing FMEInstanceID',
            event
        });
    }
    
};

module.exports.list = (event, context, callback) => {
    var client = new FMECloudAPI(process.env.TOKEN);
    client.instances().then((instances) => {
        callback(null, {
            message: 'lambda-fme-cloud (list-instances) called successfully!',
            FMEInstanceList: instances,
            event
        });
    }).catch(callback);
};
