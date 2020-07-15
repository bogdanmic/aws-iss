'use strict'

// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
})
const path = require('path')
const schedule = require('./schedulers')

// Register 3rd party plugins:
// Templates rendering plugin configured with handlebars
fastify.register(require('point-of-view'), {
    engine: {
        handlebars: require('handlebars')
    },
    includeViewExtension: true,
    layout: 'layouts/main',
    root: path.join(__dirname, 'templates'),
    options: {
        partials: {
            head: '/partials/head.hbs',
            header: '/partials/header.hbs',
            footer: '/partials/footer.hbs'
        }
    }
})
// Adds security headers for fastify
fastify.register(require('fastify-helmet'))
// Configure the plugin for serving static files as fast as possible
fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '/public'),
    prefix: '/public/', // optional: default '/'
})

// Register our routes
fastify.register(require('./routes'))

const start = async () => {
    try {
        await fastify.listen(3000, '0.0.0.0', (err, address) => {
            if (err) {
                fastify.log.error(err)
                process.exit(1)
            }
            fastify.log.info(`server listening on ${address}`)
            schedule.start();
            fastify.log.info(`Schedulers started.`)
        })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()