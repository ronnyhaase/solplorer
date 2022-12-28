import cls from "classnames"

const Input = ({ className, ...rest }) => (
  <input
    className={cls(
      'bg-inset',
      'border-2',
      'border-solid',
      'border-transparent',
      'rounded-sm',
      'focus:border-muted',
      'p-sm',
      'text-foreground',
      'placeholder:text-muted',
      className,
    )}
    style={{ outline: 'none' }}
    {...rest} />
)

export {
  Input,
}
