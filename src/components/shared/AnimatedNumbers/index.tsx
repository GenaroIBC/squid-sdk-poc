import { useEffect, useRef, useState } from "react"
import NumbersList from "./NumbersList"

type Props = {
  value: string
}

export function AnimatedNumbers({ value }: Props) {
  const numbersRef = useRef<HTMLSpanElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const numbersElement = numbersRef.current

    const observer = new IntersectionObserver(entries => {
      const isIntersecting = entries.find(entry => entry.isIntersecting)
      if (isIntersecting) {
        setLoaded(true)
        if (numbersElement) observer.unobserve(numbersElement)
      }
    })

    if (numbersElement) {
      observer.observe(numbersElement)
    }

    return () => {
      if (numbersElement) {
        observer.unobserve(numbersElement)
      }
    }
  }, [])

  return (
    <span ref={numbersRef}>
      {loaded && <NumbersList numbers={value.split("")} />}
    </span>
  )
}
