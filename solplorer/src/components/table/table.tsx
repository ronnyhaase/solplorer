import classNames from 'classnames'

import styles from './table.module.css'

const Table = ({ children, responsive = true }) => (
  <div className={classNames({ 'overflow-x-auto': responsive })}>
    <table className={classNames(styles.table, 'w-full border-collapse text-sm md:text-md whitespace-nowrap')}>
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

const TH = ({ children }) => (
  <th className="text-center">{children}</th>
)

const TD = ({ children, ...rest }) => (
  <td className="py-xs px-sm" {...rest}>{children}</td>
)

export {
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
}
