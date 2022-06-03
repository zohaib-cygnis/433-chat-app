import { get } from './get.action'
import { me } from './me.action'

import authenticate from '../../middlewares/authenticate'
import { exceptionHandler } from '../../middlewares/exception-handler'

module.exports = {
    '/': {
        get: {
            middlewares: [authenticate],
            action: exceptionHandler(get),
        },
    },
    '/me': {
        get: {
            middlewares: [authenticate],
            action: exceptionHandler(me),
        },
    },
}
