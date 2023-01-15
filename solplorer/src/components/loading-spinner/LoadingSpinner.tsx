import styles from './loading-spinner.module.css'

const LoadingSpinner = ({
  size = null,
  margin = null,
}) => {
  let style: any = {}
  if (size) {
    style.width = size
    style.height = size
  }
  if (margin) style.margin = `${margin} auto`

  return (
    <div className={styles.Spinner} style={style}>
      <div className={styles.Bounce1}></div>
      <div className={styles.Bounce2}></div>
    </div>
  )
}

export {
  LoadingSpinner,
}
