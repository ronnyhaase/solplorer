import request from 'got'
import get from 'lodash/get'
import Head from 'next/head'
import Image from 'next/image'

import {
  ChangeDisplay,
  Container,
  CurrencyDisplay,
  Grid,
  NumberDisplay,
  Panel,
} from '../components'
import { TableRenderer } from '../components/table-renderer'

export default function Protocols({ tvlData }) {
  return (
    <>
      <Head>
        <title>Solplorer - TVL &amp; Protocols</title>
      </Head>
      <main>
        <Container>
          <Grid columns={1}>
            <Panel>
              {tvlData ? (
                <TableRenderer
                  columns={[
                    { id: 'symbol', title: 'Symbol', sortable: true, renderContent: (protocol) => (
                      <div className="d-flex items-center">
                        <Image
                          alt={`${protocol.name} Logo`}
                          src={protocol.imageUrl}
                          width={16}
                          height={16}
                          className="overflow-hidden"
                        />
                        <span>&nbsp;{(protocol.symbol || '').toUpperCase()}</span>
                      </div>
                    )},
                    { id: 'name', title: 'Name', sortable: true },
                    { id: 'category', title: 'Category', sortable: true },
                    { id: 'tvl', title: 'TVL', sortable: true, renderContent: (protocol) => (
                      <>
                        <CurrencyDisplay short val={protocol.tvl} />
                        {' '}
                        <ChangeDisplay percent val={protocol.change_24h} />
                      </>
                    )},
                    { id: 'dominancePercent', title: 'Dominance', sortable: true, renderContent: (protocol) => (
                      <>
                        <NumberDisplay val={protocol.dominancePercent} suffix=" %" />
                      </>
                    )},
                    { id: 'marketCap', title: 'Market Cap.', sortable: true, renderContent: (protocol) => (
                      <>
                        <CurrencyDisplay short val={protocol.marketCap} />
                      </>
                    )},
                  ]}
                  data={tvlData.data.protocols}
                  rowKeyColId="name"
                  onSortChange={(col, dir, updateData) => {
                    const sortedData = tvlData.data.protocols.sort((colA, colB) => {
                      let a = get(colA, col.id)
                      let b = get(colB, col.id)

                      if (a === null && typeof b === 'number') a = Number.MIN_SAFE_INTEGER
                      if (a === null && typeof b === 'string') a = String.fromCodePoint(0x10ffff)
                      if (typeof a === 'number' && b === null) b = Number.MIN_SAFE_INTEGER
                      if (typeof a === 'string' && b === null) b = String.fromCodePoint(0x10ffff)

                      if (a < b) return (dir === 'ASC') ? -1 : 1
                      else if (a > b) return (dir === 'ASC') ? 1 : -1
                      else return 0
                    })
                    updateData(sortedData)
                  }}
                />) : null}
            </Panel>
          </Grid>
        </Container>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  return { props: {
    tvlData: await request(`${process.env.API_URL}/tvl`).json()
  }}
}
