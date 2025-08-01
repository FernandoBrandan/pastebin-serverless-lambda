import Redis from 'ioredis'
// export const clientRedis = new Redis({ host: 'redis', port: 6379, })
export const clientRedis = new Redis({ host: 'localhost', port: 6379, })
clientRedis.on('connect', () => console.log('Redis connected'))
clientRedis.on('error', (err) => console.error('Redis error', err))