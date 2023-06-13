import { ethers } from "ethers"

type Props = {
  status?: ethers.providers.TransactionResponse | null
  tokenPrice?: number
}

export const StakingStatus = ({ status }: Props) => {
  return (
    <>
      {status ? (
        <section className="shadow rounded-lg p-6 bg-slate-800">
          <h5 className="text-xl text-white font-semibold">
            Transaction Status
          </h5>
          <h6 className="mt-2 mb-4">
            <a
              className="text-sm"
              href={`https://axelarscan.io/gmp/${status.hash}`}
            >
              View on Axelarscan
            </a>
          </h6>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h6 className="text-base font-medium mb-2">Value</h6>
              <p className="whitespace-nowrap truncate text-xs">
                {status.value.toString()}
              </p>
            </div>
            <div>
              <h6 className="text-base font-medium mb-2">Hash</h6>
              <p className="whitespace-nowrap truncate text-xs">
                {status.hash}
              </p>
            </div>
            <div>
              <h6 className="text-base font-medium mb-2">From</h6>
              <p className="whitespace-nowrap truncate text-xs">
                {status.from}
              </p>
            </div>
            <div>
              <h6 className="text-base font-medium mb-2">To</h6>
              <p className="whitespace-nowrap truncate text-xs">{status.to}</p>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
