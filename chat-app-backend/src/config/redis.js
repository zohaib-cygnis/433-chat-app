const redis = require('redis')

let client = null

export const createClient = async () => {
    if (!client) {
        client = redis.createClient({
            port: process.env.REDIS_PORT || '6379',
            host: process.env.REDIS_HOST || 'localhost',
            password: process.env.REDIS_PASSWORD || undefined,
        })
    }
    return client
}
