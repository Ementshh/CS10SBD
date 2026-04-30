const Redis = require('ioredis');

// Gunakan URL Redis dari environment variable, jika tidak ada fallback ke memori (mock) 
// atau biarkan Vercel tidak error saat koneksi gagal
const redisUrl = process.env.REDIS_URL;

let redis;

if (redisUrl) {
    redis = new Redis(redisUrl);
} else {
    // Mock redis in serverless environment if no URL provided
    redis = {
        get: async () => null,
        set: async () => null,
        setex: async () => null,
        del: async () => null,
        on: () => {},
    };
    console.log('No REDIS_URL provided, Redis is mocked/disabled.');
}

if (redis.on) {
    redis.on('connect', () => {
        console.log('Successfully connected to Redis!');
    });

    redis.on('error', (err) => {
        console.error('Redis connection error:', err.message);
    });
}

module.exports = redis;
