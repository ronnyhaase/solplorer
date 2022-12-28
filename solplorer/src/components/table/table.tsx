import classNames from 'classnames'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'

import styles from './table.module.css'

// Fallback: ⬍⬆︎⬇︎ ⇅↑↓
const SortingDisplay = ({ state = null, ...rest }: { state?: 'ASC' | 'DESC' | null }) => {
  if (state === 'ASC') return (<FaSortUp {...rest} />)
  else if (state === 'DESC') return (<FaSortDown {...rest} />)
  else return (<FaSort className="text-background" {...rest} />)
}

const Table = ({ children, className = '', responsive = true, ...rest }) => (
  <div className={classNames({ 'overflow-x-auto': responsive })}>
    <table className={classNames(styles.table, 'w-full border-collapse text-sm md:text-md whitespace-nowrap', className)} {...rest}>
      {children}
    </table>
  </div>
)

const THead = ({ children }) => (
  <thead className="text-muted">{children}</thead>
)

const TBody = ({ children }) => (
  <tbody>{children}</tbody>
)

const TR = ({ children, ...rest }) => (
  <tr {...rest}>{children}</tr>
)

const TH = ({ children, className = null, ...rest }) => (
  <th className={classNames('text-center', className)} {...rest}>{children}</th>
)

const TD = ({ children, ...rest }) => (
  <td className="py-xs px-sm" {...rest}>{children}</td>
)

export {
  SortingDisplay,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
}
