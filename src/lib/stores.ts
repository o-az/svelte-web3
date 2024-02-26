import type { Hex } from 'viem'
import { writable, type Writable } from 'svelte/store'

export const blockStore: Writable<
  Array<{
    hash: Hex
    number: bigint
    timestamp: bigint
    transactionsCount: number
  }>
> = writable([])
