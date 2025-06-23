interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

class SlidingWindowRateLimit {
  private requests: Map<string, number[]> = new Map()
  private maxRequests: number
  private windowMs: number

  constructor(config: RateLimitConfig) {
    this.maxRequests = config.maxRequests
    this.windowMs = config.windowMs
  }

  isAllowed(key: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // Remove requests outside the window
    const validRequests = requests.filter(timestamp => now - timestamp < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(key, validRequests)
    
    return true
  }

  getRetryAfter(key: string): number {
    const requests = this.requests.get(key) || []
    if (requests.length === 0) return 0
    
    const oldestRequest = Math.min(...requests)
    const retryAfter = Math.max(0, this.windowMs - (Date.now() - oldestRequest))
    
    return Math.ceil(retryAfter / 1000) // Convert to seconds
  }
}

// Global rate limiters
export const estatedRateLimit = new SlidingWindowRateLimit({
  maxRequests: 100,
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
}) 