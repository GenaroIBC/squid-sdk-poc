import { ethers } from "ethers"
import { MOONWELL_GLMR_CONTRACT_ADDRESS } from "../constants"
import ENV from "../config/env"
import { KnownResponse } from "../types"

type Params = {
  signer: ethers.Signer | ethers.Wallet
}

export async function getMGLMRBalance({
  signer
}: Params): Promise<KnownResponse<string>> {
  const address = await signer.getAddress()

  if (!address) return { ok: false, error: "Could not retrieve signer address" }

  const provider = new ethers.providers.JsonRpcProvider(
    ENV.VITE_MOONBEAM_RPC_ENDPOINT
  )

  const abi = ["function balanceOf(address) view returns (uint256)"]
  const contract = new ethers.Contract(
    MOONWELL_GLMR_CONTRACT_ADDRESS,
    abi,
    provider
  )

  const balance = (await contract.balanceOf(address)) as ethers.BigNumber

  return { ok: true, data: balance.toString() }
}
