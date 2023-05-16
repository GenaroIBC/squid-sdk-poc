type Props = {
  children: React.ReactNode
  title: string
}

export function List({ children, title }: Props) {
  return (
    <article className="flex-grow bg-slate-800 p-2 flex flex-col gap-2">
      <h3 className="font-bold text-xl text-center text-white">{title}</h3>
      <ul className="flex flex-col rounded-md max-h-96 overflow-auto">
        {children}
      </ul>
    </article>
  )
}
