import classNames from 'classnames'

import Box from '../box'
import StandardProps from '../StandardProps'
import styles from './Grid.module.css'

type GridProps = StandardProps & {
  columns: 1 | 2 | 3 | 4
}

const Grid = ({ className= '', children, columns = 2, ...rest }: GridProps) => (
  <Box className={classNames(styles.grid, styles[`columns${columns}`], className)} {...rest}>{children}</Box>
)

export default Grid
