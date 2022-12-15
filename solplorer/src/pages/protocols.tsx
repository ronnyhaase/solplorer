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
  TableRenderer,
} from '../components'
import { sortTableData } from '../components/table-renderer/helper'

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
                    { id: 'symbol', title: 'Symbol', sortable: true, defaultSortOrder: 'ASC', renderContent: (protocol) => (
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
                    { id: 'name', title: 'Name', sortable: true, defaultSortOrder: 'ASC' },
                    { id: 'category', title: 'Category', sortable: true, defaultSortOrder: 'ASC' },
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
                  stickyFirstCol={true}
                  onSortChange={(col, dir, updateData) => {
                    const sortedData = tvlData.data.protocols.sort(sortTableData(col, dir))
                    updateData(sortedData)
                  }}
                  sortingColId="tvl"
                  sortingDirection="DESC"
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
