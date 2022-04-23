import Head from "next/head"
import Link from "next/link"

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
    </>
  )
}

export default Layout
