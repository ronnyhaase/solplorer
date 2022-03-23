import { classNames as cx } from 'react-extras'

import Box from "../box"
import styles from './Grid.module.css'

type GridProps = {
  children: any,
  columns: 1 | 2 | 3 | 4
}

const Grid = ({ children, columns = 2 }: GridProps) => (
  <Box className={cx(styles.grid, styles[`columns${columns}`])}>{children}</Box>
)

export default Grid
