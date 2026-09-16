/**
 * Chip de status: cor + ICONE de forma distinta + PALAVRA.
 *
 * Nunca renderize um status so com cor. Ver o comentario em icons.jsx.
 */
export function Chip({ tom, Icone, children }) {
  return (
    <span className="chip" data-tom={tom}>
      {Icone ? <Icone /> : null}
      {children}
    </span>
  )
}
