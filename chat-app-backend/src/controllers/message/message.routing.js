import { get } from './get.action'
import { create } from './create.action'

import authenticate from '../../middlewares/authenticate'
import { exceptionHandler } from '../../middlewares/exception-handler'

module.exports = {
    '/': {
        get: {
            middlewares: [authenticate],
            action: exceptionHandler(get),
        },
        post: {
            middlewares: [authenticate],
            action: exceptionHandler(create),
        },
    },
}
