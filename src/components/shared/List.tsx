type Props = {
  children: React.ReactNode
}

export function List({ children }: Props) {
  return (
    <ul className="flex flex-col flex-grow rounded-xl bg-slate-800 max-h-96 overflow-auto">
      {children}
    </ul>
  )
}
