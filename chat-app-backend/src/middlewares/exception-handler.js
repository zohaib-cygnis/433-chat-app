import translate from '../helpers/translate'

export default (error, request, response, next) => {
    if (process.env.MYSQL_DB_LOGGING !== false) {
        // eslint-disable-next-line
        console.log(error, 'error')
    }
    switch (error.name) {
        case 'AppValidationError':
            response.status(error.code).json({
                message: error.message,
            })

            break

        default:
            response.status(500).json({
                message: translate('errors', 'default'),
            })
    }
}

export const exceptionHandler = (callback) => {
    return (request, response, next) => {
        return callback(request, response, next).catch(next)
    }
}
