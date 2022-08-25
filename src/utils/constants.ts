export const TITLE = 'Tokenlog · Token-weighted backlogs'
export const DESCRIPTION =
  'Democratize your open-source software project. A better way for projects to collaborate with their biggest supporters.'
export const MAIN_URL = 'https://tokenlog.xyz/'
export const IMAGE_URL = 'https://tokenlog.xyz/icon.png'

export const CREATOR_NOTICE = '2020 — wslyvh'

export const DEFAULT_CACHE_REVALIDATE = 5

export const VOTE_VERSION = 2

export const PRIMARY_COLOR = '#0366d6'
export const SECONDARY_COLOR = '#2f363d'

export const SUPPORTED_CHAINS = {
  1: {
    chainId: '0x1',
    rpcUrls: ['https://rpc.flashbots.net'],
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  137: {
    chainId: '0x89',
    rpcUrls: ['https://rpc-mainnet.matic.network/'],
    chainName: 'Matic Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  80001: {
    chainId: '0x13881',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    chainName: 'Mumbai Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  100: {
    chainId: '0x64',
    rpcUrls: ['https://rpc.gnosischain.com/'],
    chainName: 'Gnosis Chain',
    nativeCurrency: {
      name: 'xDai',
      symbol: 'xDai',
      decimals: 18,
    },
    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet/'],
  },
  10: {
    chainId: '0xA',
    rpcUrls: ['https://mainnet.optimism.io'],
    chainName: 'Optimism',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  42161: {
    chainId: '0xA4B1',
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://arbiscan.io/'],
  },
  56: {
    chainId: '0x38',
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    blockExplorerUrls: ['https://bscscan.com'],
  },
  43114: {
    chainId: '0xA86A',
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    chainName: 'Avalanche Network',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    blockExplorerUrls: ['https://snowtrace.io/'],
  },
  250: {
    chainId: '0xFA',
    rpcUrls: ['https://rpc.ftm.tools/'],
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    blockExplorerUrls: ['https://ftmscan.com/'],
  },
}
