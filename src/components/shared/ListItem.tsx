interface Props
  extends React.DetailedHTMLProps<
    React.LiHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  > {
  imgSrc: string
  imgAlt: string
  title: string
  subtitle: string
}

export function ListItem({
  imgAlt,
  imgSrc,
  subtitle,
  title,
  className,
  ...props
}: Props) {
  return (
    <li
      className={`${className} flex items-center p-2 gap-2 border-b border-gray-700 bg-slate-900 hover:bg-slate-800`}
      {...props}
    >
      <img
        className="w-6 h-6 aspect-square rounded-full"
        src={imgSrc}
        alt={imgAlt}
      />
      <h4 className="font-bold">{title}</h4>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </li>
  )
}
