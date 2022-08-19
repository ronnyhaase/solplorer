import Image from 'next/image'
import Link from 'next/link'

import logoImg from '../../../public/assets/images/logo-32.svg'

const Logo = () => (
  <Link href="/">
    <a className="d-flex items-center justify-center no-underline text-inherit">
      <Image alt="Solplorer Logo" src={logoImg} />
      <h1>
        Solplorer
      </h1>
    </a>
  </Link>
)

export default Logo
