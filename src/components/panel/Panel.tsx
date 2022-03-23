import Box from "../box"
import StandardProps from "../StandardProps"

const Panel = ({ children, ...rest }: StandardProps) => (
  <Box className="bg-outset p-md rounded-md" { ...rest }>{children}</Box>
)

export default Panel
