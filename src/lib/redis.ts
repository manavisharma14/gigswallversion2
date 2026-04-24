import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export const gigsRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "10 m")
})

export const applyRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(20, "1 h")
})

export const loginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(10, "15 m")
})

export const chatRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(30, "1 m")
})