<script lang="ts">
  import { getBlock } from '@wagmi/core'
  import { blockStore } from '$lib/stores.ts'
  import { wallet, config } from '$lib/wallet.ts'
  import Connect from '$lib/components/connect.svelte'
  import { createQuery } from '@tanstack/svelte-query'

  let error: any
  let pollingInterval = 15_000

  $: blocksQuery = createQuery({
    queryKey: ['blocks'],
    queryFn: async () => {
      const { number, hash, transactions, timestamp } = await getBlock(config)
      blockStore.update(blocks => [
        ...blocks,
        { number, hash, transactionsCount: transactions.length, timestamp }
      ])

      return blockStore
    },
    enabled: $wallet.isConnected,
    refetchInterval: pollingInterval
  })

  $: if ($blocksQuery.status === 'error') error = $blocksQuery.error
</script>

<main
  class="mx-auto mt-12 flex h-full w-full flex-col items-center justify-start space-y-6 sm:space-y-14"
>
  <div
    class="flex flex-col items-center justify-center space-x-3 space-y-2 text-3xl sm:flex-row sm:space-y-0"
  >
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://kit.svelte.dev"
      class="rounded-sm bg-orange-400 px-2 py-1 font-mono hover:underline"
    >
      svelte
    </a>
    <span class="hidden sm:block">/</span>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://wagmi.sh"
      class="rounded-sm bg-purple-400 px-2 py-1 font-mono hover:underline"
    >
      wagmi
    </a>
    <span class="hidden sm:block">/</span>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://tanstack.com"
      class="rounded-sm bg-blue-700 px-2 py-1 font-mono text-pink-200 underline-offset-2 hover:bg-blue-600 hover:underline"
    >
      @tanstack/query
    </a>
  </div>
  <Connect />
  {#if $blockStore.length}
    <section class="flex flex-col items-center justify-center space-y-1 sm:space-y-4">
      <h1 class="mb-3 text-4xl font-bold sm:mb-8">Blocks</h1>
      <ul class="flex flex-col items-center justify-center space-y-2">
        <li class="flex w-full flex-row items-baseline justify-between space-x-4">
          <p class="w-auto text-left text-2xl font-extrabold md:w-36">block</p>
          <p class="hidden w-full text-left text-2xl font-extrabold md:block">hash</p>
          <p class="text-right text-2xl font-extrabold">txs</p>
          <p class="text-2xl font-extrabold">timestamp</p>
        </li>
        {#each $blockStore as block}
          <li class="flex w-full flex-row items-baseline justify-between space-x-4">
            <p class="text-left text-xl font-semibold tabular-nums">{block.number}</p>
            <p class="hidden w-full text-left text-xl font-semibold tabular-nums md:block">
              {block.hash}
            </p>
            <p class="text-right text-xl font-semibold tabular-nums">{block.transactionsCount}</p>
            <p class="text-right text-xl font-semibold tabular-nums">{block.timestamp}</p>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</main>
<footer
  class="sticky bottom-0 mx-auto flex h-min items-center justify-center rounded-md align-middle font-mono font-semibold"
>
  <p class="bg-white px-2 hidden sm:block">what would you like to see next?</p>
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="https://github.com/o-az/svelte-web3"
    class="bg-cyan-500 px-2 font-mono font-semibold text-white hover:underline"
  >
    github.com/o-az/svelte-web3
  </a>
</footer>
