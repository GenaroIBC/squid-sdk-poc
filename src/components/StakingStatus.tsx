import { StakingResult } from "../types"

type Props = {
  status?: StakingResult | null
  tokenPrice?: number
}

export function StakingStatus({ status, tokenPrice }: Props) {
  const { fromChain, toChain, fromToken, toToken, value } = status ?? {}

  return (
    <>
      {status ? (
        <article className="rounded-md px-4 py-8 flex flex-col gap-4 items-center justify-center bg-slate-950/60 w-full">
          <span className="text-green-500 font-bold text-lg">Success!</span>
          <span className="text-green-400">
            ${(Number(tokenPrice ?? 0) * Number(value)).toFixed(2)}
          </span>

          <div className="flex w-full justify-between items-center gap-4 p-4 rounded-md">
            <div className="flex flex-col gap-2 w-1/2">
              <span className="font-bold flex text-lg text-white items-center gap-2">
                <img
                  width={20}
                  height={20}
                  src={fromChain?.chainIconURI}
                  alt={fromChain?.chainName}
                />
                {fromChain?.chainName}
              </span>
              <span className="font-bold text-sm text-gray-400 flex items-center gap-2">
                <img
                  width={15}
                  height={15}
                  src={fromToken?.logoURI}
                  alt={fromToken?.symbol}
                />
                {value} {fromToken?.symbol}
              </span>
            </div>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <div className="flex flex-col gap-2 w-1/2">
              <span className="font-bold flex text-lg justify-end text-white items-center gap-2">
                {toChain?.chainName}
                <img
                  width={20}
                  height={20}
                  src={toChain?.chainIconURI}
                  alt={toChain?.chainName}
                />
              </span>
              <span className="font-bold text-sm text-gray-400 flex justify-end items-center gap-2">
                {toToken?.symbol}
                <img
                  width={15}
                  height={15}
                  src={toToken?.logoURI}
                  alt={toToken?.symbol}
                />
              </span>
            </div>{" "}
          </div>
        </article>
      ) : (
        <></>
      )}
    </>
  )
}
