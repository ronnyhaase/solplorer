import Head from 'next/head'
import useSWR from 'swr'

import { Container, Grid } from '../../components'
import Epoch from './epoch'
import MarketAndSupply from './market-and-supply'

const Dashboard = ({ sseUrl }: { sseUrl: string }) => {
  const { data: epochData } = useSWR('/api/epoch', url => fetch(url).then((res) => res.json()))
  const { data: marketData } = useSWR('/api/market', url => fetch(url).then((res) => res.json()))
  const { data: slotData } = useSWR('/api/slot', url => fetch(url).then((res) => res.json()), { refreshInterval: 500 })
  const { data: supplyData } = useSWR('/api/supply', url => fetch(url).then((res) => res.json()))

  return (
    <>
      <Head>
        <title>Solplorer - Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Grid columns={1}>
          <Epoch epochData={epochData} slotData={slotData} />
          <MarketAndSupply marketData={marketData} supplyData={supplyData} />
        </Grid>
      </Container>
    </>
  )
}

export default Dashboard
