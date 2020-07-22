'use strict'

const config = require('config');

const interactiveEC2Instances = config.get('aws.interactiveInstances.ec2')
const interactiveRDSInstances = config.get('aws.interactiveInstances.rds')

const allowedOperations = ["START", "STOP"];

exports.getInteractiveEC2Instances = () => interactiveEC2Instances;
exports.getInteractiveRDSInstances = () => interactiveRDSInstances;

exports.isEC2InstanceInteractive = function (instanceId) {
    return interactiveEC2Instances.indexOf(instanceId) > -1;
}

exports.isRDSInstanceInteractive = function (instanceId) {
    return interactiveRDSInstances.indexOf(instanceId) > -1;
}

exports.isOperationAllowed = function (operation) {
    return allowedOperations.indexOf(operation) > -1;
}

exports.isOperationStart = function (operation) {
    return operation.toLowerCase() === "START".toLowerCase();
}

exports.isOperationStop = function (operation) {
    return operation.toLowerCase() === "STOP".toLowerCase();
}