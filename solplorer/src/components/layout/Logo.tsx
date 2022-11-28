import Image from 'next/image'
import Link from 'next/link'

import logoImg from '../../../public/assets/images/logo-32.svg'

const Logo = () => (
  <div className="d-flex items-center justify-center">
      <Link href="/">
        <a className="d-flex items-center justify-center no-underline text-inherit">
          <Image alt="Solplorer Logo" src={logoImg} />
          <h1 className="d-inline">
            Solplorer
          </h1>
        </a>
      </Link>
      <Link href="https://twitter.com/solplorer/status/1597198055199363072" target="_blank">
        <a className="ml-sm no-underline" target="_blank">
          <sup>Alpha</sup>
        </a>
      </Link>
    </div>
)

export default Logo
