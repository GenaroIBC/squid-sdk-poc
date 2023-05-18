import { useEffect, useId, useRef } from "react"

type Props = {
  children: React.ReactNode
  label: React.ReactNode
}

export function Dropdown({ label, children }: Props) {
  const dropdownId = useId()
  const checkboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const closeDropdownOnOutsideClick = (e: MouseEvent) => {
      if (
        checkboxRef.current &&
        !checkboxRef.current.contains(e.target as Node)
      ) {
        checkboxRef.current.checked = false
      }
    }

    window.addEventListener("click", closeDropdownOnOutsideClick)

    return () => {
      window.removeEventListener("click", closeDropdownOnOutsideClick)
    }
  })

  return (
    <div className="relative">
      <input
        ref={checkboxRef}
        type="checkbox"
        hidden
        id={dropdownId}
        className="peer hidden absolute"
      />
      <label
        htmlFor={dropdownId}
        className="peer flex items-center space-x-1 cursor-pointer bg-slate-700 px-4 py-2 rounded-xl"
      >
        {label}

        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </label>

      <div className="w-full peer-checked:opacity-100 peer-checked:pointer-events-auto pointer-events-none absolute mt-1 right-0 top-full min-w-max shadow rounded-xl opacity-0 bg-gray-300 border border-gray-700 transition delay-75 ease-in-out z-10 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
