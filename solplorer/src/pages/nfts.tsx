import request from 'got'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FaDiscord, FaTwitter, FaLink } from 'react-icons/fa'

import {
  Box,
  ChangeDisplay,
  Container,
  CurrencyDisplay,
  DateDisplay,
  Grid,
  NumberDisplay,
  Panel,
  TH,
  TR,
  TableRenderer,
} from '../components'
import { sortTableData } from '../components/table-renderer/helper'

export default function NftCollectionsPage({ nftCollectionsData }) {
  return (
    <>
      <Head>
        <title>Solplorer - NFT Collections</title>
      </Head>
      <main className="grow">
        <Container>
          <Grid columns={1}>
            <Panel>
              {nftCollectionsData ? <TableRenderer
                columns={[
                  { id: 'name', title: 'Collection', sortable: true, defaultSortOrder: 'ASC', renderContent: (collection) => (
                    <Box
                      className="d-flex items-center py-xs overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ maxWidth: '28ch' }}
                    >
                        <Image
                          alt={collection.name}
                          src={`https://ckaumumkea.cloudimg.io/${collection.imageUrl}?w=128&q=80`}
                          className="rounded mr-sm overflow-hidden"
                          width={48}
                          height={48}
                        />
                        {' '}
                        {collection.name}
                    </Box>
                  )},
                  { id: 'links', title: 'Links', sortable: false, renderContent: (collection) => (
                    <>
                      {collection.urlWebsite
                        ? <Link className="ml-sm" href={collection.urlWebsite}>
                          <FaLink title="Website" />
                        </Link>
                        : null}
                      {collection.urlTwitter
                        ? <Link className="ml-sm" href={collection.urlTwitter}>
                          <FaTwitter title="Twitter" />
                        </Link>
                        : null}
                      {collection.urlDiscord
                        ? <Link className="ml-sm" href={collection.urlDiscord}>
                          <FaDiscord title="Discord" />
                        </Link>
                        : null}
                    </>
                  )},
                  { id: 'marketCap', title: 'Market Cap.', sortable: true, renderContent: (collection) => (
                    <CurrencyDisplay currency="USD" short val={collection.marketCap} />
                  )},
                  { id: 'price.floor', title: 'Floor', sortable: true, renderContent: (collection) => (
                    <>
                      <NumberDisplay prefix="◎ "  val={collection.price.floor} />
                      {' '}
                      <ChangeDisplay percent val={collection.price.floorChangePercent_24h} />
                    </>
                  )},
                  { id: 'price.avg', title: 'Avg', sortable: true, renderContent: (collection) => (
                    <>
                      <NumberDisplay prefix="◎ " val={collection.price.avg} />
                      {' '}
                      <ChangeDisplay percent val={collection.price.avgChangePercent_24h} />
                    </>
                  )},
                  { id: 'price.max', title: 'High', sortable: true, renderContent: (collection) => (
                    <NumberDisplay prefix="◎ " val={collection.price.max} />
                  )},
                  { id: 'volume.1h', title: '1h', sortable: true, renderContent: (collection) => (
                    <CurrencyDisplay currency="USD" short val={collection.volume['1h']} />
                  )},
                  { id: 'volume.24h', title: '24h', sortable: true, renderContent: (collection) => (
                    <CurrencyDisplay currency="USD" short val={collection.volume['24h']} />
                  )},
                  { id: 'volume.7day', title: '7day', sortable: true, renderContent: (collection) => (
                    <CurrencyDisplay currency="USD" short val={collection.volume['7day']} />
                  )},
                  { id: 'supply.listed', title: 'Listed', sortable: true, renderContent: (collection) => (
                    <NumberDisplay short val={collection.supply.listed} />
                  )},
                  { id: 'supply.holders', title: 'Holders', sortable: true, renderContent: (collection) => (
                    <NumberDisplay short val={collection.supply.holders} />
                  )},
                  { id: 'supply.total', title: 'Total', sortable: true, renderContent: (collection) => (
                    <NumberDisplay short val={collection.supply.total} />
                  )},
                ]}
                data={nftCollectionsData.data}
                rowKeyColId="hyperspace_id"
                onSortChange={(col, dir, updateData) => {
                  const sortedData = nftCollectionsData.data.sort(sortTableData(col, dir))
                  updateData(sortedData)
                }}
                sortingColId="marketCap"
                sortingDirection="DESC"
                renderHeadContent={({ children }) => (
                  <>
                    <TR>
                      <TH colSpan={4}>{' '}</TH>
                      <TH colSpan={3}>Price</TH>
                      <TH colSpan={3}>Volume</TH>
                      <TH colSpan={3}>Supply</TH>
                    </TR>
                    {children}
                  </>
                )}
              /> : null}
              <div>
                  <div className="d-flex items-center justify-center my-md">
                    <span>Data provided by</span>
                    <a href="https://hyperspace.xyz/" className="d-flex">
                      <img alt="Hyperspace" src="/assets/images/hyperspace.svg" />
                    </a>
                  </div>
                  <div className="text-center">
                    Last updated: <DateDisplay val={new Date(nftCollectionsData.updatedAt)} dateStyle="long" />
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
    nftCollectionsData: await request(`${process.env.API_URL}/nft-collections`).json()
  }}
}
