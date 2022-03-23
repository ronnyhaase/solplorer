import StandardProps from "../StandardProps"

const Box = ({ as: Tag = 'div', children, ...rest }: StandardProps) => (
  <Tag {...rest}>{ children }</Tag>
)

export default Box
