import Head from 'next/head'
import useSWR from 'swr'

import { Container, Grid } from '../../components'
import Epoch from './epoch'
import MarketAndSupply from './market-and-supply'
import News from './news'
import Top10 from './top10'

const Dashboard = () => {
  const { data: news } = useSWR('/api/news', url => fetch(url).then((res) => res.json()))
  const { data: marketData } = useSWR('/api/market', url => fetch(url).then((res) => res.json()))
  const { data: statsData } = useSWR(
    '/api/stats',
    url => fetch(url).then((res) => res.json()).then(body => body.data),
    { refreshInterval: 5000 }
  )
  const { data: supplyData } = useSWR('/api/supply', url => fetch(url).then((res) => res.json()))
  const { data: top10Data } = useSWR('/api/top10', url => fetch(url).then((res) => res.json()))

  return (
    <main>
      <Head>
        <title>Solplorer - Dashboard</title>
      </Head>
      <Container>
        <Grid columns={1}>
          <Epoch statsData={statsData} />
          <MarketAndSupply marketData={marketData} supplyData={supplyData} />
          <Top10 top10Data={top10Data} />
          <News news={news} />
        </Grid>
      </Container>
    </main>
  )
}

export default Dashboard
