import { TOKEN_PRICE_API_URL } from "../constants"
import { KnownResponse } from "../types"

type Params = { chainId: string; tokenAddress: string }

export async function getTokenPrice({
  chainId,
  tokenAddress
}: Params): Promise<KnownResponse<number>> {
  try {
    const searchParams = new URLSearchParams({
      chainId,
      tokenAddress
    }).toString()

    const response = await fetch(`${TOKEN_PRICE_API_URL}?${searchParams}`)
    const data = await response.json()

    const price = (data as { price: number })?.price ?? 0

    return { ok: true, data: price }
  } catch (error) {
    return { ok: false, error: "There was an error obtaining token price" }
  }
}
