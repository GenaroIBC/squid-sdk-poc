import { StatusResponse } from "@0xsquid/sdk"

type Props = {
  status?: StatusResponse | null
}
export function StakingStatus({ status }: Props) {
  return (
    <>
      {status ? (
        <article className="flex flex-col gap-4 p-4 bg-slate-800 rounded-md my-4">
          <p className="text-green-400 font-bold">
            Success!{" "}
            <a href={status.axelarTransactionUrl} target="_blank">
              View on Axelar scan
            </a>
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              From
              <img
                width={32}
                height={32}
                src={status.fromChain?.chainData.chainIconURI}
                alt={status.fromChain?.chainData.chainName}
              />
              {status.fromChain?.chainData.chainName}
            </span>
            <span className="flex items-center gap-2">
              to
              <img
                width={32}
                height={32}
                src={status.toChain?.chainData.chainIconURI}
                alt={status.toChain?.chainData.chainName}
              />
              {status.toChain?.chainData.chainName}
            </span>
          </div>
        </article>
      ) : (
        <p>No status</p>
      )}
    </>
  )
}
