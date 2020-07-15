'use strict'

// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
})
const fastifyStatic = require('fastify-static')
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
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '/public'),
    prefix: '/public/', // optional: default '/'
})

// Register static resources
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free'),
    prefix: '/vendor/fontawesome/',
    decorateReply: false // the reply decorator has been added by the first plugin registration
})
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../node_modules/bootstrap/dist'),
    prefix: '/vendor/bootstrap/',
    decorateReply: false // the reply decorator has been added by the first plugin registration
})
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../node_modules/jquery/dist'),
    prefix: '/vendor/jquery/',
    decorateReply: false // the reply decorator has been added by the first plugin registration
})
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../node_modules/vue/dist'),
    prefix: '/vendor/vue/',
    decorateReply: false // the reply decorator has been added by the first plugin registration
})
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../node_modules/axios/dist'),
    prefix: '/vendor/axios/',
    decorateReply: false // the reply decorator has been added by the first plugin registration
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