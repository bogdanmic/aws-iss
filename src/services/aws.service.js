'use strict'

const mapper = require('./mapper.service')
const doorman = require('./doorman.service')

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const config = require('config');

// Set the region 
AWS.config.update({
    region: config.get('aws.region')
});

// Create EC2 service object
const ec2 = new AWS.EC2({
    apiVersion: '2016-11-15'
});

// Create RDS service object
const rds = new AWS.RDS({
    apiVersion: '2016-11-15'
});

exports.getEC2Instances = async () => {
    return ec2.describeInstances().promise()
        .then(mapper.mapEC2Instances);
}

exports.getRDSInstances = async () => {
    return rds.describeDBInstances().promise()
        .then(mapper.mapRDSInstances);
}

exports.changeEC2InstanceState = async (instanceId, desiredOperation) => {

    return new Promise((resolve, reject) => {

        if (!doorman.isEC2InstanceInteractive(instanceId)) {
            reject(new Error("Instance state can not be changed!"));
        }

        if (!doorman.isOperationAllowed(desiredOperation)) {
            reject(new Error("Operation is not allowed!"));
        }
        // Build the params for the ec2 action
        var action;
        var params = {
            // DryRun: true,
            InstanceIds: [instanceId]
        };
        if (doorman.isOperationStart(desiredOperation)) {
            action = ec2.startInstances(params).promise()
                .then(response => {
                    // We start or stop only one instance at a time
                    var inst = response.StartingInstances[0];
                    return `Transitioning from '${inst.PreviousState.Name}' to '${inst.CurrentState.Name}'.`
                });
        }
        if (doorman.isOperationStop(desiredOperation)) {
            action = ec2.stopInstances(params).promise()
                .then(response => {
                    // We start or stop only one instance at a time
                    var inst = response.StoppingInstances[0];
                    return `Transitioning from '${inst.PreviousState.Name}' to '${inst.CurrentState.Name}'.`
                });
        }
        resolve(action);
    });

}

exports.changeRDSInstanceState = async (instanceId, desiredOperation) => {

    return new Promise((resolve, reject) => {

        if (!doorman.isRDSInstanceInteractive(instanceId)) {
            reject(new Error("Instance state can not be changed!"));
        }

        if (!doorman.isOperationAllowed(desiredOperation)) {
            reject(new Error("Operation is not allowed!"));
        }
        // Build the params for the ec2 action
        var action;
        var params = {
            DryRun: true,
            DBInstanceIdentifier: instanceId
        };
        if (doorman.isOperationStart(desiredOperation)) {
            action = rds.startDBInstance(params).promise()
                .then(response => {
                    console.log(response); //TODO: fix this response when able. can not test in staging for now
                    // We start or stop only one instance at a time
                    var inst = response.StartingInstances[0];
                    return `Transitioning from '${inst.PreviousState.Name}' to '${inst.CurrentState.Name}'.`
                });
        }
        if (doorman.isOperationStop(desiredOperation)) {
            action = rds.stopDBInstance(params).promise()
                .then(response => {
                    console.log(response); //TODO: fix this response when able. can not test in staging for now
                    // We start or stop only one instance at a time
                    var inst = response.StoppingInstances[0];
                    return `Transitioning from '${inst.PreviousState.Name}' to '${inst.CurrentState.Name}'.`
                });
        }
        resolve(action);
    });

}