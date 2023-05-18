const ENV = {
  LOCAL_WALLET_PRIVATE_KEY: import.meta.env.VITE_LOCAL_WALLET_PRIVATE_KEY,
  ETHEREUM_RPC_ENDPOINT: import.meta.env.VITE_ETHEREUM_RPC_ENDPOINT,
  AVALANCHE_RPC_ENDPOINT: import.meta.env.VITE_AVALANCHE_RPC_ENDPOINT,
  POLYGON_RPC_ENDPOINT: import.meta.env.VITE_POLYGON_RPC_ENDPOINT,
  MOONBEAM_RPC_ENDPOINT: import.meta.env.VITE_MOONBEAM_RPC_ENDPOINT
}

Object.entries(ENV).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`${key} environment variable is not defined`)
  }
})

export default ENV
