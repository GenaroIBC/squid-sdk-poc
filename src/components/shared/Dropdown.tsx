type Props = {
  children: React.ReactNode
  label: string
}
export function Dropdown({ label, children }: Props) {
  return (
    <div className="relative bg-slate-300 py-2 px-4 rounded-md">
      <input type="checkbox" id="dropdown" className="peer hidden absolute" />
      <label
        htmlFor="dropdown"
        className="peer flex items-center space-x-1 cursor-pointer"
      >
        <span className="text-lg text-black">{label}</span>
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

      <div className="w-full peer-checked:opacity-100 peer-checked:pointer-events-auto pointer-events-none absolute mt-1 right-0 top-full min-w-max shadow rounded opacity-0 bg-gray-300 border border-gray-400 transition delay-75 ease-in-out z-10">
        {children}
      </div>
    </div>
  )
}
