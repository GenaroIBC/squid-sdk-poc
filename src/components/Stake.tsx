import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEffect, useState } from "react"
import { stakeMGLMR } from "../services/stakeMGLMR"
import type { ChainData, TokenData } from "@0xsquid/sdk"
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
import type { StakingResult } from "../types"

export function Stake() {
  const [selectedChain, setSelectedChain] = useState<Partial<ChainData>>(
    squidClient.chains[0]
  )
  const [selectedToken, setSelectedToken] = useState<Partial<TokenData>>(
    squidClient.tokens.find(token => token.chainId === selectedChain.chainId) ??
      squidClient.tokens[0]
  )
  const signer = useSigner()

  const [status, setStatus] = useState<StakingResult | null>(null)
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
    setStatus(null)
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
    <section className="flex mx-auto flex-col gap-2 p-4 rounded-md h-screen bg-slate-900">
      <nav className="flex justify-between w-full gap-2 items-center max-w-5xl mx-auto">
        <form onSubmit={handleChangeSquidBaseURL} className="flex gap-2">
          <input
            type="url"
            name="squid-base-url"
            id="squid-base-url"
            placeholder="Squid Base URL"
            className="p-2 text-sm bg-slate-800 focus:bg-slate-70 rounded-md min-w-0 w-full flex-grow-0 placeholder-gray-400 text-white focus:outline-none"
          />
          <button className="bg-blue-500 rounded-md text-sm py-2 p-4 w-fit whitespace-nowrap hover:bg-blue-600">
            Change URL
          </button>
        </form>

        <ConnectButton />
      </nav>

      {signer.data && (
        <section className="flex flex-col items-center justify-center gap-2 my-20 max-w-md mx-auto">
          <article className="flex gap-2 items-center justify-between bg-blue-950 p-4 rounded-md">
            <div className="flex flex-col gap-2 w-1/2 overflow-hidden">
              <AmountForm
                handleChange={event => setAmount(event.target.value)}
              />
              <span className="text-gray-400 w-full text-sm">
                ${(tokenPrice * Number(amount)).toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Dropdown
                label={
                  <span className="text-white flex gap-2 items-center text-base">
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
                  <span className="text-white flex gap-2 items-center text-base">
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
            </div>
          </article>

          <button
            className="bg-blue-500 flex justify-center items-center py-2 px-4 text-white w-full"
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
          {error && (
            <p className="overflow-hidden w-full text-red-400 text-xs border-2 border-red-400 bg-red-950 text-center py-1 px-2 rounded-md">
              {error}
            </p>
          )}

          <StakingStatus status={status} tokenPrice={tokenPrice} />
        </section>
      )}
    </section>
  )
}
