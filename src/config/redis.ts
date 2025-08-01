import Redis from 'ioredis'

const redisHost = process.env.REDIS_HOST || 'localhost'
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10)
export const clientRedis = new Redis({ host: redisHost, port: redisPort })

clientRedis.on('connect', () => console.log('Redis connected'))
clientRedis.on('error', (err) => console.error('Redis error', err))