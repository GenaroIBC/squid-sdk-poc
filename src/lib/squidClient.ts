import { Squid } from "@0xsquid/sdk"
import ENV from "../config/env"

const squidClient = new Squid({
  baseUrl: ENV.VITE_SQUID_API_BASE_URL
})

await squidClient.init()

export default squidClient
