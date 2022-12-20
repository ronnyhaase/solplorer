import cls from 'classnames'

import { Box } from '../'
import styles from './buttons.module.css'

const Button = ({ children, className = '', ...rest }) => (
  <button
    className={cls(
      styles.Button,
      className,
    )}
    {...rest}
  >
    {children}
  </button>
)

const ButtonGroup = ({ children, className = '', ...rest }) => (
  <Box
    className={cls(styles.ButtonGroup, className)}
    {...rest}
  >
    {children}
  </Box>
)

export {
  Button,
  ButtonGroup,
}
