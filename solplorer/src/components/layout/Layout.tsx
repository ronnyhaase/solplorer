import Head from "next/head"
import Link from "next/link"
import Container from "../container"

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="m-0 py-lg">
        <Link href="/">
          <a className="d-flex items-center justify-center no-underline text-color-inherit">
            <img alt="Solplorer Logo" src="/logo-32.png" />
            <h1 className="ml-sm">
              Solplorer
            </h1>
          </a>
        </Link>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <Container className="text-center">
          <p>
            Copyright &copy; <a href="https://ronnyhaase.com">Ronny Haase</a>, 2022
          </p>
          <p>
            Solplorer is free software under <a href="https://www.gnu.org/licenses/gpl-3.0">GNU
            General Public License</a> version 3 and you're invited
            <a href="https://github.com/ronnyhaase/solplorer"> to contribute</a>.<br />
            This program comes with ABSOLUTELY NO WARRANTY.
          </p>
        </Container>
      </footer>
    </>
  )
}

export default Layout
