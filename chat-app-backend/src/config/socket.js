import redis from 'socket.io-redis'

import authenticate from '../middlewares/socket'
import onConnection from '../callbacks/onConnection'

module.exports = (app) => {
    const server = require('http').createServer(app)

    const io = require('socket.io')(server, {
        cookie: false,
        serveClient: false,
        transports: ['websocket'],
    })

    io.adapter(
        redis({
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD || undefined,
        })
    )

    io.use(authenticate).on('connect', onConnection)

    return server
}
