'use strict'

const awsService = require('../services/aws.service')

exports.index = async (request, reply) => {
    reply.view('index', {
        text: 'text'
    })
    return reply
}

exports.getEC2Instances = async (request, reply) => {
    return awsService.getEC2Instances();
}

exports.changeEC2InstanceState = async (request, reply) => {
    var instanceId = request.params.instanceId;
    var desiredOperation = request.body.desiredOperation;
    return awsService.changeEC2InstanceState(instanceId, desiredOperation);
}

exports.getRDSInstances = async (request, reply) => {
    return awsService.getRDSInstances();
}

exports.changeRDSInstanceState = async (request, reply) => {
    var instanceId = request.params.instanceId;
    var desiredOperation = request.body.desiredOperation;
    return awsService.changeRDSInstanceState(instanceId, desiredOperation);
}