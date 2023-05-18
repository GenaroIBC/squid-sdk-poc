import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useState } from "react"
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

export function Stake() {
  const [selectedChain, setSelectedChain] = useState<Partial<ChainData>>(
    squidClient.chains[0]
  )
  const [selectedToken, setSelectedToken] = useState<Partial<TokenData>>(
    squidClient.tokens.find(token => token.chainId === selectedChain.chainId) ??
      squidClient.tokens[0]
  )

  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [amount, setAmount] = useState("0")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStake = () => {
    const { address, decimals } = selectedToken
    const { chainId } = selectedChain
    if (!chainId || !address || !decimals) return

    setLoading(true)
    setError(null)
    stakeMGLMR({
      fromChain: Number(chainId),
      fromToken: address,
      weiAmount: ethers.utils.parseUnits(amount, decimals).toString()
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

  return (
    <section className="flex max-w-lg mx-auto flex-col gap-4 items-center justify-center bg-slate-900 p-4 rounded-md">
      <div className="flex justify-center my-8">
        <ConnectButton />
      </div>

      <section className="flex flex-wrap gap-2 justify-center items-center">
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

      <button
        className="bg-blue-500 py-2 px-4 text-white"
        disabled={
          loading || !amount || !selectedToken.address || !selectedChain.chainId
        }
        onClick={handleStake}
      >
        {loading ? <Loading width="1.5rem" height="1.5rem" /> : <>Stake</>}
      </button>
      {error && <p className="text-red-500 text-xs">{error}</p>}

      <StakingStatus status={status} />
    </section>
  )
}
