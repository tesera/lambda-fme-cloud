'use strict';

const FMECloudAPI = require('fme-cloud-api');
const FMEServerAPI = require('fme-server-api');

module.exports.start = (event, context, callback) => {
    console.log(event);

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
    console.log(event);

    if(event.FMEInstanceID) {
        var client = new FMECloudAPI(process.env.TOKEN);
        client.pause(event.FMEInstanceID).then(() => {
            callback(null, event);
        }).catch(console.error);
    } else {
        callback(JSON.stringify({
            message: 'Missing FMEInstanceID',
            event
        }));
    }
    
};

module.exports.list = (event, context, callback) => {
    console.log(event);

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
    console.log(event);

    var client = new FMEServerAPI(process.env.SERVER, process.env.SERVER_TOKEN);

    // Translate parameters if required
    var parameters;
    if(typeof event.job.parameters == "object")
    {
        parameters = Object.keys(event.job.parameters).map((name) => {
            return {
                "name": name,
                "value": event.job.parameters[name]
            }
        });
        parameters = { "publishedParameters": parameters }
    } else {
        parameters = event.job.parameters;
    }

    console.log("Parameters sent to API:", parameters);

    client.submitJob(event.job.repository, event.job.workspace, parameters).then((res) => {
        console.log(res);
        event.jobOutput = JSON.parse(res)
        callback(null, event);
    })
    .catch(callback);
}

module.exports.checkJobComplete = (event, context, callback) => {
    console.log(event);
    if(!event.desiredStatus) event.desiredStatus = "SUCCESS"

    var client = new FMEServerAPI(process.env.SERVER, process.env.SERVER_TOKEN);
    client.getJob(event.id).then((res) => {
        res = JSON.parse(res);
        console.log(`Job ${event.id} is ${res.status}`);
        if(res.status != event.desiredStatus)
            return Promise.reject(`Desired state has not been reached. ${res.status}!=${event.desiredStatus}`)
        callback(null, res.status);
    })
    .catch((err) => {
        callback(JSON.stringify(err));
    });
}
