import { ethers } from "ethers"
import { KnownResponse } from "../types"
import squidClient from "../lib/squidClient"
import moonwellGlmrAbi from "../abi/moonwellGlmrAbi"
import { RouteData } from "@0xsquid/sdk"
import {
  MOONBEAM_ID,
  MOONWELL_GLMR_CONTRACT_ADDRESS,
  NATIVE_TOKEN,
  SquidCallType
} from "../constants"

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
      toChain: MOONBEAM_ID,
      toToken: NATIVE_TOKEN,
      slippage: 1,

      customContractCalls: [
        {
          callType: SquidCallType.FULL_NATIVE_BALANCE,
          target: MOONWELL_GLMR_CONTRACT_ADDRESS,
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
          target: MOONWELL_GLMR_CONTRACT_ADDRESS,
          value: "0",
          callData: transferMglmrEncodeData,
          payload: {
            tokenAddress: MOONWELL_GLMR_CONTRACT_ADDRESS,
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
