import Head from 'next/head'
import Script from 'next/script'

import { Container } from '../container'
import Logo from './Logo'
import Navigation from './Navigation'

const Layout = ({ children }) => {
  return (
    <>
      <Script data-domain="solplorer.org" src="https://plausible.io/js/plausible.js" strategy="afterInteractive" />
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Solplorer • Solana blockchain explorer</title>
        <meta name="description" content="Solplorer - The independent and open-source Solana blockchain explorer"></meta>
        <meta property="og:title" content="Solplorer • Solana blockchain explorer"></meta>
        <meta property="og:descripion" content="Solplorer - The independent and open-source Solana blockchain explorer"></meta>
        <meta property="og:url" content="https://solplorer.org"></meta>
        <meta property="og:image" content="https://solplorer.org/assets/images/social-preview.jpg"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:description" content="Solplorer - The independent and open-source Solana blockchain explorer"></meta>
        <meta name="twitter:image" content="https://solplorer.org/assets/images/social-preview.jpg"></meta>
        <meta name="twitter:image:alt" content="Solplorer • Solana blockchain explorer"></meta>
        <meta name="twitter:site" content="@solplorer"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover"></meta>
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

export { Layout }
