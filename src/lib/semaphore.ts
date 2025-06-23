export class Semaphore {
  private permits: number
  private queue: Array<() => void> = []

  constructor(permits: number) {
    this.permits = permits
  }

  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      if (this.permits > 0) {
        this.permits--
        resolve()
      } else {
        this.queue.push(resolve)
      }
    })
  }

  release(): void {
    this.permits++
    if (this.queue.length > 0) {
      this.permits--
      const next = this.queue.shift()!
      next()
    }
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire()
    try {
      return await fn()
    } finally {
      this.release()
    }
  }
}

// Global ATTOM semaphore (5 concurrent requests max)
export const attomSemaphore = new Semaphore(5) 