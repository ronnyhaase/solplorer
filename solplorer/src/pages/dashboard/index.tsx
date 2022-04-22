import Head from 'next/head'
import useSWR from 'swr'

import { Container, Grid } from '../../components'
import Epoch from './epoch'
import MarketAndSupply from './market-and-supply'

const Dashboard = ({ sseUrl }: { sseUrl: string }) => {
  const { data: epochData } = useSWR('/api/epoch', url => fetch(url).then((res) => res.json()))
  const { data: marketData } = useSWR('/api/market', url => fetch(url).then((res) => res.json()))
  const { data: slotData } = useSWR('/api/slot', url => fetch(url).then((res) => res.json()), { refreshInterval: 1000 })
  const { data: supplyData } = useSWR('/api/supply', url => fetch(url).then((res) => res.json()))

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
            <Epoch epochData={epochData} slotData={slotData} />
            <MarketAndSupply marketData={marketData} supplyData={supplyData} />
          </Grid>
        </Container>
      </main>
    </>
  )
}

export default Dashboard
