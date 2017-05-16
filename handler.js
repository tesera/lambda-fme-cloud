'use strict';

const FMECloudAPI = require('fme-cloud-api');
const FMEServerAPI = require('fme-server-api');

module.exports.start = (event, context, callback) => {
    if(event.FMEInstanceID) {
        var client = new FMECloudAPI(process.env.TOKEN);
        client.start(event.FMEInstanceID);
        callback(null, event);
    } else {
        callback(JSON.stringify({
            message: 'Missing FMEInstanceID',
            event
        }));
    }
};

module.exports.pause = (event, context, callback) => {
    if(event.FMEInstanceID) {
        var client = new FMECloudAPI(process.env.TOKEN);
        client.pause(event.FMEInstanceID).then(() => {
            callback(null, event);
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

module.exports.submitJob = (event, context, callback) => {
    var client = new FMEServerAPI(process.env.SERVER, process.env.SERVER_TOKEN);

    client.submitJob(event.job.repository, event.job.workspace, event.job.parameters).then((res) => {
        event.jobOutput = res
        callback(null, event);
    })
    .catch(callback);
}

module.exports.checkJobComplete = (event, context, callback) => {
    var client = new FMEServerAPI(process.env.SERVER, process.env.SERVER_TOKEN);

    client.getJob(event.jobID).then((res) => {
        res = JSON.parse(res);
        console.log(`Job ${event.jobID} is ${res.status}`);
        callback(null, res.status);
    })
    .catch((err) => {
        callback(JSON.stringify(err));
    });
}
