type Props = {
  children: React.ReactNode
}

export function List({ children }: Props) {
  return (
    <article className="flex-grow bg-slate-800">
      <ul className="flex flex-col rounded-md max-h-96 overflow-auto">
        {children}
      </ul>
    </article>
  )
}
