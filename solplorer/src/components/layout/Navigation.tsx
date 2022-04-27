import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'

import Container from '../container'

const Nav = ({ children }) => (
  <ul className={classNames(
    'd-flex', 'overflow-x-auto', 'overflow-y-hidden', 'flex-nowrap',
    'justify-evenly', 'list-none', 'm-0', 'p-0'
  )}>
    {children}
  </ul>
)

const NavItem = ({ children, curr, to }) => {
  const active = curr === to

  return (
    <li className="pr-md whitespace-nowrap">
      <Link href={to}>
        <a
          className={classNames(
            'd-block',
            'pb-xs',
            'no-underline',
            {
              'text-color-inherit': active,
              'text-muted': !active,
              'border-solid': active,
              'border-0': active,
              'border-b-2': active,
              'border-image-solana': active,
            },
        )}>
          {children}
        </a>
      </Link>
    </li>
  )
}

const Navigation = () => {
  const { asPath: currentPath } = useRouter()

  return (
    <nav className="bg-inset py-sm">
      <Container>
        <Nav>
          <NavItem curr={currentPath} to="/dashboard">Dashboard</NavItem>
          <NavItem curr={currentPath} to="/tokens">Tokens</NavItem>
          <NavItem curr={currentPath} to="/protocols">Protocols &amp; TVL</NavItem>
          <NavItem curr={currentPath} to="/validators">Validators</NavItem>
        </Nav>
      </Container>
    </nav>
  )
}

export default Navigation
