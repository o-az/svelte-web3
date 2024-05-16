declare global {
  namespace App {
    interface Platform {
      env: {}
      context: {
        waitUntil(promise: Promise<any>): void
      }
      caches: CacheStorage & { default: Cache }
    }
  }
  interface Window {
    EventEmitter: typeof EventEmitter
  }
}

export {}
