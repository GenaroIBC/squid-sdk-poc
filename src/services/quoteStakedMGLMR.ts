import { ethers } from "ethers"
import { KnownResponse } from "../types"
import squidClient from "../lib/squidClient"
import moonwellGlmrAbi from "../abi/moonwellGlmrAbi"
import { RouteData } from "@0xsquid/sdk"

const moonwellGlmrAddress = "0x091608f4e4a15335145be0A279483C0f8E4c7955"

const moonbeamId = 1284
const nativeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

const SquidCallType = {
  DEFAULT: 0,
  FULL_TOKEN_BALANCE: 1,
  FULL_NATIVE_BALANCE: 2,
  COLLECT_TOKEN_BALANCE: 3
}

type Params = {
  fromChain: number
  fromToken: string
  weiAmount: string
  signer: ethers.Wallet | ethers.Signer
}

export async function quoteStakedMGLMR({
  fromChain,
  fromToken,
  weiAmount,
  signer
}: Params): Promise<KnownResponse<RouteData>> {
  try {
    const signerAddress = await signer.getAddress()

    const moonwellGlmrInterface = new ethers.utils.Interface(moonwellGlmrAbi)
    const mintEncodeData = moonwellGlmrInterface.encodeFunctionData("mint")
    const transferMglmrEncodeData = moonwellGlmrInterface.encodeFunctionData(
      "transfer",
      [signerAddress, "0"]
    )

    const { route } = await squidClient.getRoute({
      toAddress: signerAddress,
      fromChain,
      fromToken,
      fromAmount: weiAmount,
      toChain: moonbeamId,
      toToken: nativeToken,
      slippage: 1,

      customContractCalls: [
        {
          callType: SquidCallType.FULL_NATIVE_BALANCE,
          target: moonwellGlmrAddress,
          value: "0",
          callData: mintEncodeData,
          payload: {
            tokenAddress: "0x",
            inputPos: 1
          },
          estimatedGas: "250000"
        },
        {
          callType: SquidCallType.FULL_TOKEN_BALANCE,
          target: moonwellGlmrAddress,
          value: "0",
          callData: transferMglmrEncodeData,
          payload: {
            tokenAddress: moonwellGlmrAddress,
            inputPos: 1
          },
          estimatedGas: "50000"
        }
      ]
    })

    return { ok: true, data: route }
  } catch (error) {
    return {
      ok: false,
      error: "there was an error getting token quote"
    }
  }
}
