import { AnimatedNumbers } from "./shared/AnimatedNumbers/index.tsx"
import { useEffect, useRef, useState } from "react"

type Props = {
  tokenName: string
  balance: string
}

export function TokenBalance({ balance, tokenName }: Props) {
  const lastBalance = useRef(balance)
  const [b, setB] = useState(balance)
  useEffect(() => {
    if (lastBalance.current !== balance) {
      setB(balance)
      lastBalance.current = balance
    }
  }, [balance])

  return b ? (
    <span className="flex items-center gap-2 font-bold">
      <span>{tokenName}</span>
      <span className="text-green-400">
        <AnimatedNumbers value={b} />
      </span>
    </span>
  ) : (
    <>No balance yet</>
  )
}
