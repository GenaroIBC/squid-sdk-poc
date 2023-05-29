import { useEffect, useRef, useState } from "react"
import { ItemNumber } from "./ItemNumber"

type Props = {
  numbers: string[]
}

export default function NumbersList({ numbers }: Props) {
  const numbersRef = useRef<HTMLSpanElement>(null)
  const [styles, setStyles] = useState({ height: 0 })

  useEffect(() => {
    const handleSetStyles = () => {
      const numbers = numbersRef.current?.firstChild?.firstChild as HTMLElement

      const height = numbers?.clientHeight

      if (height !== styles.height) {
        setStyles({
          height: numbers?.clientHeight
        })
      }
    }
    handleSetStyles()

    return () => {
      window.removeEventListener("resize", handleSetStyles)
    }
  }, [styles.height])

  return (
    <span
      ref={numbersRef}
      className="flex flex-row relative select-all"
      style={styles}
    >
      {numbers.map((value, index) => {
        const isNumber = /^[0-9]$/.test(value)
        if (!isNumber) return value

        return <ItemNumber key={index} value={+value} height={styles.height} />
      })}
    </span>
  )
}
