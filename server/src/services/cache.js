const redis = require('ioredis')
const util = require('util')

const redisUrl = process.env.REDIS_URL
const client = new redis(redisUrl)

export default client
