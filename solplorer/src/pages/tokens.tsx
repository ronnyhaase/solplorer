import request from 'got'
import Head from 'next/head'
import Image from 'next/image'

import {
  ChangeDisplay,
  Container,
  CurrencyDisplay,
  DateDisplay,
  Grid,
  NumberDisplay,
  Panel,
  TableRenderer,
} from '../components'
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
                    { id: 'price.current', title: 'Price', sortable: true, renderContent: (token) => (
                      <>
                        <CurrencyDisplay currency="USD" maxDecimals={3} val={token.price.current} />
                        {' '}
                        <ChangeDisplay percent val={token.price.changePercent_24h} />
                      </>
                    )},
                    { id: 'volume', title: 'Volume', sortable: true, renderContent: (token) => (
                      <CurrencyDisplay currency="USD" short val={token.volume} />
                    )},
                    { id: 'marketCap.current', title: 'Market Cap.', sortable: true, renderContent: (token) => (
                      <>
                        <CurrencyDisplay currency="USD" short val={token.marketCap.current} />
                        {' '}
                        <ChangeDisplay percent val={token.marketCap.changePercent_24h} />
                      </>
                    )},
                    { id: 'supply', title: 'Supply (Circ. / Total)', renderContent: (token) => (
                      <>
                        <NumberDisplay short val={token.supply.circulating} />
                        {' '}/{' '}
                        <NumberDisplay short val={token.supply.total} />
                      </>
                    )},
                    { id: 'fdv', title: 'FDV', sortable: true, renderContent: (token) => (
                      <><NumberDisplay short val={token.fdv} /></>
                    )},
                  ]}
                  data={tokenData.data}
                  rowKeyColId="id"
                  stickyFirstCol={true}
                  onSortChange={(col, dir, updateData) => {
                    const sortedData = tokenData.data.sort(sortTableData(col, dir))
                    updateData(sortedData)
                  }}
                  sortingColId="marketCap"
                  sortingDirection="DESC"
                />
              ) : null}
            <div>
              <div className="my-md text-center">
                Data provided by<br />
                <a href="https://coingecko.com/" target="_blank" rel="noreferrer">
                  <img alt="Coingecko" src="/assets/images/coingecko.svg" />
                </a>
              </div>
              <div className="text-center">
                Last updated: <DateDisplay val={new Date(tokenData.updatedAt)} dateStyle="long" />
              </div>
            </div>
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
