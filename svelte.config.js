import adapter from 'sveltekit-adapter-deno';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    /** @note `$` is a svelte path alias convention */
    alias: {
      $: './src/',
      $styles: './src/styles'
    }
  }
}
