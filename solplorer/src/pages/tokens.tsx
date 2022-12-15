import request from 'got'
import Head from 'next/head'
import Image from 'next/image'

import {
  ChangeDisplay,
  Container,
  CurrencyDisplay,
  Grid,
  NumberDisplay,
  Panel,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  DateDisplay,
} from '../components'
import { TableRenderer } from '../components/table-renderer'
import { sortTableData } from '../components/table-renderer/helper'

export default function Tokens({ tokenData }) {
  return (
    <>
      <Head>
        <title>Solplorer - Tokens</title>
      </Head>
      <main className="grow">
        <Container>
          <Grid columns={1}>
            <Panel>
              {tokenData ? (
                <TableRenderer
                  columns={[
                    { id: 'symbol', title: 'Symbol', sortable: true, defaultSortOrder: 'ASC', renderContent: (token) => (
                      <div className="d-flex items-center">
                        <Image
                          alt={`${token.name} Logo`}
                          src={token.imageUrl}
                          width={16}
                          height={16}
                          className="overflow-hidden"
                        />
                        <span>&nbsp;{token.symbol.toUpperCase()}</span>
                      </div>
                    )},
                    { id: 'name', title: 'Name', sortable: true, defaultSortOrder: 'ASC', renderContent: (token) => (
                      <div
                        style={{ maxWidth: '24ch' }}
                        className="overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        {token.name}
                      </div>
                    ) },
                    { id: 'price', title: 'Price', sortable: true, renderContent: (token) => (
                      <>
                        <CurrencyDisplay currency="USD" maxDecimals={3} val={token.price} />
                        {' '}
                        <ChangeDisplay percent val={token.priceChangePercent_24h} />
                      </>
                    )},
                    { id: 'volume', title: 'Volume', sortable: true, renderContent: (token) => (
                      <CurrencyDisplay currency="USD" short val={token.volume} />
                    )},
                    { id: 'marketCap', title: 'Market Cap.', sortable: true, renderContent: (token) => (
                      <>
                        <CurrencyDisplay currency="USD" short val={token.marketCap} />
                        {' '}
                        <ChangeDisplay percent val={token.marketCapChangePercent_24h} />
                      </>
                    )},
                    { id: 'supplyTotal', title: 'Supply (Circ. / Total)', renderContent: (token) => (
                      <>
                        <NumberDisplay short val={token.supplyCirculating} />
                        {' '}/{' '}
                        <NumberDisplay short val={token.supplyTotal} />
                      </>
                    )},
                  ]}
                  data={tokenData.data}
                  rowKeyColId="id"
                  onSortChange={(col, dir, updateData) => {
                    const sortedData = tokenData.data.sort(sortTableData(col, dir))
                    updateData(sortedData)
                  }}
                  sortingColId="marketCap"
                  sortingDirection="DESC"
                />
              ) : null}
            </Panel>
          </Grid>
        </Container>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  return { props: {
    tokenData: await request(`${process.env.API_URL}/tokens`).json()
  }}
}
