import Image from 'next/image'
import Link from 'next/link'

const Logo = () => (
  <div className="d-flex items-center justify-center">
    <Link className="d-flex items-center justify-center no-underline text-inherit" href="/">
      <img alt="Solplorer Logo" src="/assets/images/logo-32.svg" />
      <h1 className="d-inline">
        Solplorer
      </h1>
    </Link>
    <Link className="ml-sm no-underline" href="https://twitter.com/solplorer/status/1597198055199363072" target="_blank">
      <sup>Alpha</sup>
    </Link>
  </div>
)

export default Logo
