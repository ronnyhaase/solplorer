import request from 'got'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaDiscord, FaTwitter, FaLink, FaArrowLeft, FaArrowRight, FaSearch } from 'react-icons/fa'
import useDebounce from 'react-use/lib/useDebounce'

import {
  Box,
  ButtonGroup,
  Button,
  ChangeDisplay,
  Container,
  CurrencyDisplay,
  DateDisplay,
  Input,
  NumberDisplay,
  Panel,
  TH,
  TR,
  TableRenderer,
} from '../components'
import { sortTableData } from '../components/table-renderer/helper'

const TableActions = ({ state, actions }) => {
  const [searchVal, setSearchVal] = useState('')

  useDebounce(() => {
    actions.setFilters({ search: searchVal })
  }, 500, [searchVal])

  return (
    <Box className="d-flex flex-col md:flex-row justify-evenly bg-slant p-md rounded-md rounded-tr-md">
      <Box className="d-flex items-center md:w-1/2">
        <ButtonGroup className="mr-sm">
          <Button onClick={() => actions.prevPage()}>
            <FaArrowLeft /><span className="VisuallyHidden">Previous page</span>
          </Button>
          <Button onClick={() => actions.nextPage()}>
            <FaArrowRight /><span className="VisuallyHidden">Next page</span>
          </Button>
        </ButtonGroup>
        Page {state.page} of {state.pageCount}
      </Box>
      <Box className="d-flex items-center md:w-1/2 mt-sm md:mt-0">
        <FaSearch className="text-muted mr-sm" />
        <Input
          type="text"
          placeholder="Search"
          className="grow"
          value={searchVal}
          onInput={el => setSearchVal(el.target.value)}
        />
      </Box>
    </Box>
  )
}

export default function NftCollectionsPage({ nftCollectionsData }) {
  return (
    <>
      <Head>
        <title>Solplorer - NFT Collections</title>
      </Head>
      <main className="grow">
        <Container>
          <Panel>
            {nftCollectionsData ? <TableRenderer
              columns={[
                {
                  id: 'imageUrl', title: 'Image', sortable: false,
                  renderContent: (collection) => (
                    <Box className="d-flex py-xs">
                      <Image
                        alt={collection.name}
                        src={`https://ckaumumkea.cloudimg.io/${collection.imageUrl}?w=128&q=80`}
                        className="rounded mr-sm"
                        width={48}
                        height={48}
                      />
                    </Box>
                  ),
                  renderTHContent: ({ title }) => (<Box className="VisuallyHidden">{title}</Box>),
                },
                { id: 'name', title: 'Collection', sortable: true, defaultSortOrder: 'ASC', renderContent: (collection) => (
                  <Box
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{ maxWidth: '24ch' }}
                  >
                    {collection.name}
                  </Box>
                )},
                {
                  id: 'links', title: 'Links', sortable: false,
                  renderTHContent: ({ title }) => (<Box className="VisuallyHidden">{title}</Box>),
                  renderContent: (collection) => (
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
                  )
                },
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
              stickyFirstCol={true}
              onSortChange={(col, dir, updateData) => {
                const sortedData = nftCollectionsData.data.sort(sortTableData(col, dir))
                updateData(sortedData)
              }}
              sortingColId="marketCap"
              sortingDirection="DESC"
              onFiltersChange={(filters, updateData) => {
                console.log('Filters changed:', filters)
              }}
              pageCount={30}
              onPageChange={(page, updateData) => {
                console.log('Page change:', page)
              }}
              renderTHeadContent={({ children }) => (
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
              renderTopActionPanel={(state, actions) => (<TableActions state={state} actions={actions} />)}
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
