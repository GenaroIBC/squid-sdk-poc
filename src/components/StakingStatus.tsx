import { StatusResponse } from "@0xsquid/sdk"

type Props = {
  status?: StatusResponse | null
}

export function StakingStatus({ status }: Props) {
  return (
    <>
      {status ? (
        <article className="flex flex-col gap-4 p-4 bg-slate-800 rounded-md my-4">
          <header className="flex items-center gap-2 justify-between">
            <span className="text-green-400">Success!</span>

            <a
              href={status.axelarTransactionUrl}
              target="_blank"
              className="text-sm"
            >
              View on Axelar scan
            </a>
          </header>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              From {status.fromChain?.chainData.chainName}
              <img
                width={20}
                height={20}
                src={status.fromChain?.chainData.chainIconURI}
                alt={status.fromChain?.chainData.chainName}
              />
            </span>
            <span className="flex items-center gap-2">
              to {status.toChain?.chainData.chainName}
              <img
                width={20}
                height={20}
                src={status.toChain?.chainData.chainIconURI}
                alt={status.toChain?.chainData.chainName}
              />
            </span>
          </div>
        </article>
      ) : (
        <p>No status</p>
      )}
    </>
  )
}
