import Image from 'next/image'
import Link from 'next/link'

import logoImg from '../../../public/logo-32.png'

const Logo = () => (
  <Link href="/">
    <a className="d-flex items-center justify-center no-underline text-color-inherit">
      <Image alt="Solplorer Logo" src={logoImg} />
      <h1 className="ml-sm">
        Solplorer
      </h1>
    </a>
  </Link>
)

export default Logo
