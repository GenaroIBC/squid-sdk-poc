const ENV = {
  VITE_LOCAL_WALLET_PRIVATE_KEY: import.meta.env.VITE_LOCAL_WALLET_PRIVATE_KEY,
  VITE_ETHEREUM_RPC_ENDPOINT:
    import.meta.env.VITE_ETHEREUM_RPC_ENDPOINT ?? "http://localhost:8500/0",
  VITE_AVALANCHE_RPC_ENDPOINT:
    import.meta.env.VITE_AVALANCHE_RPC_ENDPOINT ?? "http://localhost:8500/1",
  VITE_POLYGON_RPC_ENDPOINT:
    import.meta.env.VITE_POLYGON_RPC_ENDPOINT ?? "http://localhost:8500/2",
  VITE_MOONBEAM_RPC_ENDPOINT:
    import.meta.env.VITE_MOONBEAM_RPC_ENDPOINT ?? "http://localhost:8500/3",
  VITE_SQUID_API_BASE_URL:
    import.meta.env.VITE_SQUID_API_BASE_URL ?? "http://localhost:3000"
}

Object.entries(ENV).forEach(([key, value]) => {
  if (value === undefined) {
    console.warn(
      `'${key}' environment variable was not found. Using fallback value instead`
    )
  }
})

export default ENV
