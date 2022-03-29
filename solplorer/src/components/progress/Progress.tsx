import Box from '../box'
import StandardProps from '../StandardProps'

interface ProgressProps extends StandardProps {
  min?: number
  max?: number
  value?: number
}

const Progress = ({
  children,
  className = null,
  min = 0,
  max = 100,
  value = 0,
}: ProgressProps) => {
  // TODO: Consider min
  const relativeValue = (value / max) * 100

  return (
    <Box className={className}>
      <Box className="bg-inset rounded p-1px" style={{ height: '1rem', minWidth: '100px' }}>
        <Box className="bg-foreground rounded" style={{ height: 'calc(1rem - 2px)', width: `${relativeValue}%` }}>
        </Box>
      </Box>
      {children}
    </Box>
  )
}

export default Progress
