import { useId } from "react"

type Props = {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
}

export function AmountForm({ handleChange, label }: Props) {
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
        onChange={handleChange}
        type="number"
        name={amountId}
        id={amountId}
        defaultValue={0}
        min={0}
        placeholder="0"
        className="font-bold min-w-0 w-full flex-grow-0 text-2xl bg-transparent placeholder-gray-400 text-white focus:outline-none"
      />
    </form>
  )
}
