import {
  http,
  fallback,
  getClient,
  reconnect,
  getAccount,
  serialize,
  getChainId,
  watchClient,
  deserialize,
  createConfig,
  watchAccount,
  watchChainId,
  getConnectors,
  getConnections,
  watchConnectors,
  watchConnections,
  unstable_connector,
  connect as _connect,
  disconnect as _disconnect,
  switchChain as _switchChain,
  createStorage as createWagmiStorage
} from '@wagmi/core'
import { readable } from 'svelte/store'
import { injected } from '@wagmi/connectors'
import { mainnet, sepolia } from '@wagmi/core/chains'

export const chains = [sepolia, mainnet] as const
export type ConfiguredChainId = (typeof chains)[number]['id']

export type ConnectorType = 'injected'

export const config = createConfig({
  chains: [mainnet, sepolia],
  syncConnectedChain: true,
  multiInjectedProviderDiscovery: true,
  connectors: [
    injected({ shimDisconnect: true, unstable_shimAsyncInject: 2500 })
  ],
  transports: {
    [mainnet.id]: fallback([http(), unstable_connector(injected)]),
    [sepolia.id]: fallback([http(), unstable_connector(injected)])
  },
  storage: createWagmiStorage({
    serialize,
    deserialize,
    key: 'wagmi',
    storage: typeof window === 'undefined' ? undefined : window.sessionStorage
  })
})

export const client = readable(getClient(config), set =>
  watchClient(config, { onChange: set })
)
export const chainId = readable(getChainId(config), set =>
  watchChainId(config, { onChange: set })
)
export const account = readable(getAccount(config), set =>
  watchAccount(config, { onChange: set })
)
export const connectors = readable(getConnectors(config), set =>
  watchConnectors(config, { onChange: set })
)
export const connections = readable(getConnections(config), set =>
  watchConnections(config, { onChange: set })
)

reconnect(config)

export async function connect(
  type: ConnectorType,
  chainId: ConfiguredChainId | undefined
) {
  const connectors = config.connectors.filter(c => c.type === type)
  const connector = connectors[0] ?? connectors[1]

  if (connector) return _connect(config, { connector, chainId })
}

export const disconnect = () => _disconnect(config)
