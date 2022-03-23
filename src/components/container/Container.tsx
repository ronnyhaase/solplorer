import Box from '../box'
import styles from './Container.module.css'

const Container = ({ children }) => (
  <Box className={styles.container}>{children}</Box>
)

export default Container
