import classNames from 'classnames'

import Box from '../box'
import StandardProps from '../StandardProps'

const Panel = ({ children, className = '', ...rest }: StandardProps) => (
  <Box className={classNames('bg-outset p-md rounded-md', className as string)} { ...rest }>{children}</Box>
)

export default Panel
