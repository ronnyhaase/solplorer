import '../../scripts/wdyr'

import 'ronalize.css'

import '../styles/fonts.css'
import '../styles/globals.css'

import { Layout } from '../components'

function SolplorerApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default SolplorerApp
