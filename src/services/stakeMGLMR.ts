import { StatusResponse } from "@0xsquid/sdk"
import { ethers } from "ethers"
import moonwellGlmrAbi from "../abi/moonwellGlmrAbi"
import { KnownResponse } from "../types"
import { SquidError } from "@0xsquid/sdk/dist/error"
import squid from "../lib/squidClient"

const SquidCallType = {
  DEFAULT: 0,
  FULL_TOKEN_BALANCE: 1,
  FULL_NATIVE_BALANCE: 2,
  COLLECT_TOKEN_BALANCE: 3
}

const moonbeamId = 1284
const nativeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
const moonwellGlmrAddress = "0x091608f4e4a15335145be0A279483C0f8E4c7955"

type Params = {
  fromChain: number
  fromToken: string
  weiAmount: string
  signer: ethers.Wallet | ethers.Signer
}

export async function stakeMGLMR({
  fromChain,
  fromToken,
  weiAmount,
  signer
}: Params): Promise<KnownResponse<StatusResponse>> {
  try {
    const signerAddress = await signer.getAddress()

    const moonwellGlmrInterface = new ethers.utils.Interface(moonwellGlmrAbi)
    const mintEncodeData = moonwellGlmrInterface.encodeFunctionData("mint")
    const transferMglmrEncodeData = moonwellGlmrInterface.encodeFunctionData(
      "transfer",
      [signerAddress, "0"]
    )

    const { route } = await squid.getRoute({
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

    const tx = await squid.executeRoute({
      signer,
      route
    })

    const txReceipt = await tx.wait()

    await new Promise(resolve => setTimeout(resolve, 5000))

    const status = await squid.getStatus({
      transactionId: txReceipt.transactionHash
    })

    return { ok: true, data: status }
  } catch (error) {
    return {
      ok: false,
      error: error
        ? (error as SquidError)?.errors?.[0]?.message ??
          (error as SquidError)?.message
        : "There was an error, please try again later"
    }
  }
}
