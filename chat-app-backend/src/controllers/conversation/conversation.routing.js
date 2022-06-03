import { create } from './create.action'
import { get } from './get.action'

import authenticate from '../../middlewares/authenticate'
import { exceptionHandler } from '../../middlewares/exception-handler'

module.exports = {
    '/': {
        post: {
            middlewares: [authenticate],
            action: exceptionHandler(create),
        },
        get: {
            middlewares: [authenticate],
            action: exceptionHandler(get),
        },
    },
}
