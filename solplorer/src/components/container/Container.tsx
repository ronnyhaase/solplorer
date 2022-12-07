import classNames from 'classnames'

import Box from '../box'
import StandardProps from '../StandardProps'
import styles from './Container.module.css'

const Container = ({ children, className = '', ...rest }: StandardProps) => (
  <Box className={classNames(styles.container, className as string)} {...rest}>{children}</Box>
)

export default Container
