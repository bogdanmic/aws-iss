'use strict'

const fastify = require('fastify')({
    logger: true
})

const schedule = require('node-schedule');
const config = require('config'); //The js-yaml dependency is required if we want to pars yml files
const awsService = require('./services/aws.service')
const doorman = require('./services/doorman.service')

exports.start = async () => {
    const ec2Schedulers = config.get("schedulers.ec2Schedulers")
    if (ec2Schedulers.enabled) {
        schedule.scheduleJob(ec2Schedulers.startCron, () => changeEC2InstancesState("START"));
        schedule.scheduleJob(ec2Schedulers.stopCron, () => changeEC2InstancesState("STOP"));
    }
    const rdsSchedulers = config.get("schedulers.rdsSchedulers")
    if (rdsSchedulers.enabled) {
        schedule.scheduleJob(rdsSchedulers.startCron, () => changeRDSInstancesState("START"));
        schedule.scheduleJob(rdsSchedulers.stopCron, () => changeRDSInstancesState("STOP"));
    }
}

const changeEC2InstancesState = (desiredState) => {
    fastify.log.info(`Change state of EC2 instances to ${desiredState}...`);
    doorman.getInteractiveEC2Instances()
        .forEach(instanceId => {
            awsService.changeEC2InstanceState(instanceId, desiredState)
                .then(response => {
                    fastify.log.info(`${instanceId} - ${response}`);
                })
                .catch(error => {
                    fastify.log.error(`${instanceId} - ${error}`);
                });
        })
}

const changeRDSInstancesState = (desiredState) => {
    fastify.log.info(`Change state of EC2 instances to ${desiredState}...`);
    doorman.getInteractiveRDSInstances()
        .forEach(instanceId => {
            awsService.changeRDSInstanceState(instanceId, desiredState)
                .then(response => {
                    fastify.log.info(`${instanceId} - ${response}`);
                })
                .catch(error => {
                    fastify.log.error(`${instanceId} - ${error}`);
                });
        })
}