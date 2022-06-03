import path from 'path'
import lumie from 'lumie'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'

import exceptionHander from './middlewares/exception-handler'
import createClient from './config/database'
;(async function() {
    /**
     * load environment variables from .env
     */
    dotenv.config()

    /**
     * initiate the express server instance
     */
    const app = express()

    /**
     * enable cors for express app
     */
    const cors = require('cors')({
        origin: true,
    })
    app.use(cors)

    /**
     * to recognize the incoming Request Object as strings or arrays
     * for facebook data deletion request callback
     */
    app.use(express.urlencoded({ extended: false }))

    /**
     * parse the from body using body parser
     */
    app.use(bodyParser.json())

    /**
     * Bind routes with express app
     */
    lumie.load(app, {
        preURL: 'api',
        verbose: true,
        ignore: ['*.spec', '*.action', '*.md'],
        controllers_path: path.join(__dirname, 'controllers'),
    })

    /**
     * connect to the redis wait for the connection then proceed
     */
    await createClient()

    /**
     * Default exception handing
     */
    app.use(exceptionHander)

    /**
     * get express port from .env
     * or declare with default value
     */
    const port = process.env.PORT || 8000

    /*
     * pass server to socket instances and setup events
     */
    const server = require('./config/socket')(app)

    /**
     * listen to the exposed port
     */
    server.listen(port, () => {
        // eslint-disable-next-line
        console.log('App server started on port: ' + port)
    })
})()
