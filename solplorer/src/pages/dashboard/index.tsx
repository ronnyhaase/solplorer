import Head from 'next/head'

import { Container, Grid } from '../../components'
import Epoch from './epoch'
import MarketAndSupply from './market-and-supply'

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Solplorer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="d-flex items-center justify-center m-0 py-lg">
        <img alt="Solplorer Logo" src="/logo-32.png" />
        <h1 className="ml-sm">
          Solplorer
        </h1>
      </header>
      <main>
        <Container>
          <Grid columns={1}>
            <Epoch />
            <MarketAndSupply />
          </Grid>
        </Container>
      </main>
    </>
  )
}

export default Dashboard
