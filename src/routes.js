'use strict'

const controllers = require('./controllers/controllers')

async function routes(fastify, options) {
    fastify.get('/', controllers.index)
    fastify.get('/api/instances/ec2', controllers.getEC2Instances)
    fastify.put('/api/instances/ec2/:instanceId', controllers.changeEC2InstanceState)
    fastify.get('/api/instances/rds', controllers.getRDSInstances)
    fastify.put('/api/instances/rds/:instanceId', controllers.changeRDSInstanceState)
}

module.exports = routes