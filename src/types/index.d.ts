import { ChainData, TokenData } from "@0xsquid/sdk"

export type KnownResult<T> = {
  ok: true
  data: T
}

export type KnownError = {
  ok: false
  error: string
}

export type KnownResponse<T> = KnownResult<T> | KnownError

export type StakingResult = {
  value: string
  fromChain?: ChainData
  toChain?: ChainData
  fromToken?: TokenData
  toToken?: TokenData
}
