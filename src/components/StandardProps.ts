import { Properties as CSSProperties} from "csstype"

interface ExoticComponentWithDisplayName<P = unknown> extends React.ExoticComponent<P> {
  defaultProps?: Partial<P>
  displayName?: string
}

type AnyComponent<P = any> = ExoticComponentWithDisplayName<P> | React.ComponentType<P>

type KnownWebTarget = keyof JSX.IntrinsicElements | AnyComponent

type StandardProps = {
  as?: KnownWebTarget,
  children?: React.ReactNode,
  className?: React.HTMLAttributes<HTMLElement> | string,
  style?: CSSProperties,
}

export {
  type StandardProps as default,
}
