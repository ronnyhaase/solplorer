import Head from 'next/head'
import Container from '../container'
import Logo from './Logo'
import Navigation from './Navigation'

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <script defer data-domain="solplorer.org" src="https://plausible.io/js/plausible.js"></script>
      </Head>
      <header className="m-0 mb-md">
        <Logo />
        <Navigation />
      </header>
      <>
        {children}
      </>
      <footer>
        <Container className="text-center text-sm">
          <p>
            Copyright &copy; <a href="https://ronnyhaase.com">Ronny Haase</a>, 2022
          </p>
          <p>
            Solplorer is free software under <a href="https://www.gnu.org/licenses/gpl-3.0">GNU
            General Public License</a> version 3 and you&apos;re invited
            <a href="https://github.com/ronnyhaase/solplorer"> to contribute</a>.<br />
            This program comes with ABSOLUTELY NO WARRANTY.
          </p>
        </Container>
      </footer>
    </>
  )
}

export default Layout
