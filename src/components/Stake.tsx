import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEffect, useState } from "react"
import { stakeMGLMR } from "../services/stakeMGLMR"
import type { ChainData, StatusResponse, TokenData } from "@0xsquid/sdk"
import { ethers } from "ethers"
import { List } from "./shared/List"
import { ListItem } from "./shared/ListItem"
import { Dropdown } from "./shared/Dropdown"
import { Loading } from "./shared/Loading"
import squidClient from "../lib/squidClient"
import { StakingStatus } from "./StakingStatus"
import { AmountForm } from "./shared/AmountForm"
import { getTokenPrice } from "../services/getTokenPrice"
import { useSigner } from "wagmi"

export function Stake() {
  const [selectedChain, setSelectedChain] = useState<Partial<ChainData>>(
    squidClient.chains[0]
  )
  const [selectedToken, setSelectedToken] = useState<Partial<TokenData>>(
    squidClient.tokens.find(token => token.chainId === selectedChain.chainId) ??
      squidClient.tokens[0]
  )
  const signer = useSigner()

  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [amount, setAmount] = useState("1")
  const [tokenPrice, setTokenPrice] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStake = () => {
    const { address, decimals } = selectedToken
    const { chainId } = selectedChain
    if (!chainId || !address || !decimals || !signer.data) return

    setLoading(true)
    setError(null)
    stakeMGLMR({
      fromChain: Number(chainId),
      fromToken: address,
      weiAmount: ethers.utils.parseUnits(amount, decimals).toString(),
      signer: signer.data
    })
      .then(response => {
        if (!response.ok) return setError(response.error)

        setStatus(response.data)
      })
      .finally(() => setLoading(false))
  }

  const handleChangeChain = (chain: ChainData) => {
    const firstTokenOnNewChain =
      squidClient.tokens.find(token => token.chainId === chain.chainId) ??
      squidClient.tokens[0]

    setSelectedToken(firstTokenOnNewChain)
    setSelectedChain(chain)
  }

  useEffect(() => {
    const { chainId, address } = selectedToken
    if (!chainId || !address) return

    getTokenPrice({
      chainId: String(chainId),
      tokenAddress: address
    }).then(result => {
      if (!result.ok) return setError(result.error)

      return setTokenPrice(result.data)
    })
  }, [selectedToken])

  const handleChangeSquidBaseURL = async (event: React.FormEvent) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const squidBaseURL = String(formData.get("squid-base-url")).trim()
    if (squidBaseURL) {
      squidClient.setConfig({
        baseUrl: squidBaseURL
      })

      form.reset()
    }
  }

  return (
    <section className="flex max-w-lg mx-auto flex-col gap-2 items-center justify-center p-4 rounded-md">
      <div className="flex justify-center my-8">
        <ConnectButton />
      </div>

      {signer.data && (
        <>
          <section className="flex flex-wrap gap-2 justify-center items-center my-4">
            From
            <Dropdown
              label={
                <span className="text-lg text-white flex gap-2 items-center">
                  <img
                    className="w-6 h-6 aspect-square rounded-full"
                    src={selectedChain.chainIconURI}
                    alt={selectedChain.chainName}
                  />
                  {selectedChain.chainName}
                </span>
              }
            >
              <List>
                {squidClient.chains
                  .filter(chain => chain.chainType !== "cosmos")
                  .map((chain, i) => (
                    <ListItem
                      key={i}
                      imgAlt={chain.chainName}
                      imgSrc={chain.chainIconURI}
                      title={chain.chainName}
                      subtitle={chain.nativeCurrency.symbol}
                      onClick={() => handleChangeChain(chain)}
                    />
                  ))}
              </List>
            </Dropdown>
            <Dropdown
              label={
                <span className="text-lg text-white flex gap-2 items-center">
                  <img
                    className="w-6 h-6 aspect-square rounded-full"
                    src={selectedToken.logoURI}
                    alt={selectedToken.name}
                  />
                  {selectedToken.symbol}
                </span>
              }
            >
              <List>
                {squidClient.tokens
                  .filter(token => token.chainId === selectedChain.chainId)
                  .map((token, i) => (
                    <ListItem
                      key={i}
                      imgAlt={token.name}
                      imgSrc={token.logoURI}
                      title={token.symbol}
                      subtitle={token.name}
                      onClick={() => setSelectedToken(token)}
                    />
                  ))}
              </List>
            </Dropdown>
          </section>

          <AmountForm
            handleChange={event => setAmount(event.target.value)}
            label="Amount"
          />

          <span className="text-gray-400">
            {(tokenPrice * Number(amount)).toFixed(2)}$
          </span>

          <button
            className="bg-blue-500 py-2 px-4 text-white"
            disabled={
              loading ||
              !amount ||
              !selectedToken.address ||
              !selectedChain.chainId
            }
            onClick={handleStake}
          >
            {loading ? <Loading width="1.5rem" height="1.5rem" /> : <>Stake</>}
          </button>
          {error && <p className="text-red-500 text-xs">{error}</p>}

          <StakingStatus status={status} />
        </>
      )}

      <form
        onSubmit={handleChangeSquidBaseURL}
        className="flex flex-col gap-2 py-4"
      >
        <label
          htmlFor="squid-base-url"
          className="flex flex-col gap-2 text-center"
        >
          Squid Base URL 🔗
        </label>

        <div className="flex gap-2">
          <input
            type="url"
            name="squid-base-url"
            id="squid-base-url"
            className="p-2 text-xl bg-slate-800 focus:bg-slate-70 0 rounded-md placeholder-gray-400 text-white focus:outline-none"
          />
          <button className="bg-blue-500 rounded-md text-sm py-2 px-4 hover:bg-blue-600">
            Change URL
          </button>
        </div>
      </form>
    </section>
  )
}
