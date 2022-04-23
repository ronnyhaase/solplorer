import Box from '../box'
import StandardProps from '../StandardProps'
import styles from './Container.module.css'

const Container = ({ children, ...rest }: StandardProps) => (
  <Box className={styles.container} {...rest}>{children}</Box>
)

export default Container
