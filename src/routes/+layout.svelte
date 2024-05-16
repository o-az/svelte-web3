<script lang="ts">
  import '$/app.css'
  import '$/polyfill.ts'
  import {
    QueryClient,
    notifyManager,
    MutationCache
  } from '@tanstack/svelte-query'
  import { browser } from '$app/environment'
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools'
  import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client'
  import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

  if (browser) notifyManager.setScheduler(window.requestAnimationFrame)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        gcTime: 1_000 * 60 * 60 * 24, // 24 hours
        refetchOnReconnect: () => !queryClient.isMutating()
      }
    },
    mutationCache: new MutationCache({
      onSettled: () => {
        if (queryClient.isMutating() === 1) {
          return queryClient.invalidateQueries()
        }
      }
    })
  })

  const localStoragePersister = createSyncStoragePersister({
    key: 'SVELTE_QUERY',
    storage: browser ? window.localStorage : undefined // or window.sessionStorage
  })
</script>

<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister: localStoragePersister }}
>
  <slot />
  <SvelteQueryDevtools initialIsOpen={false} />
</PersistQueryClientProvider>
