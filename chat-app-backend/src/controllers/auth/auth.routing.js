import { register } from './register.action'
import { login } from './login.action'

import { exceptionHandler } from '../../middlewares/exception-handler'

module.exports = {
    '/register': {
        post: {
            middlewares: [],
            action: exceptionHandler(register),
        },
    },
    '/login': {
        post: {
            middlewares: [],
            action: exceptionHandler(login),
        },
    },
}
