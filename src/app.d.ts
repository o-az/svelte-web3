// See https://kit.svelte.dev/docs/types#app
declare global {
  namespace App {}
  interface Window {
    EventEmitter: typeof EventEmitter
  }
}

export {}
