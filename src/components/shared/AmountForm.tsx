import { useEffect, useId, useState } from "react"

type Props = {
  handleChange: (value: string) => void
  label?: string
  debounceTime: number
}

export function AmountForm({ handleChange, label, debounceTime }: Props) {
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    const debounceTimeout = setTimeout(
      () => handleChange(inputValue),
      debounceTime
    )

    return () => {
      console.log("preventing api call 🤩")
      clearTimeout(debounceTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceTime, inputValue])

  const amountId = useId()

  return (
    <form
      onSubmit={event => event.preventDefault()}
      className="flex flex-col gap-2 items-center justify-center"
    >
      {label && (
        <label
          htmlFor={amountId}
          className="text-sm font-medium text-white text-center"
        >
          {label}
        </label>
      )}
      <input
        onChange={event => setInputValue(event.target.value)}
        type="number"
        name={amountId}
        id={amountId}
        min={0}
        placeholder="0"
        className="font-bold min-w-0 w-full flex-grow-0 text-2xl bg-transparent placeholder-gray-400 text-white focus:outline-none"
      />
    </form>
  )
}
