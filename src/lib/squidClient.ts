import { Squid } from "@0xsquid/sdk"

const squidClient = new Squid({
  baseUrl: "http://localhost:3000"
})

await squidClient.init()

export default squidClient
