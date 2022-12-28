import request from 'got'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaDiscord, FaTwitter, FaLink, FaArrowLeft, FaArrowRight, FaSearch, FaTimesCircle } from 'react-icons/fa'
import useDebounce from 'react-use/lib/useDebounce'
import useSWR from 'swr'
import clx from 'classnames'

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
  THead,
  TBody,
  Table,
  TD,
  IconButton,
  SortingDisplay,
} from '../components'

const TableActions = ({ pageIndex, pageCount, prevPage, nextPage, setPageIndex, filters, setFilters }) => {
  const [searchVal, setSearchVal] = useState('')

  useDebounce(() => {
    const newSearchVal = searchVal.trim()
    if (newSearchVal) {
      if (filters && filters.q !== newSearchVal) setFilters({ q: newSearchVal })
      if (pageIndex !== 0) setPageIndex(0)
    } else {
      if (filters.q) setFilters({})
      if (pageIndex !== 0) setPageIndex(0)
    }
  }, 500, [searchVal])

  return (
    <Box className="d-flex flex-col md:flex-row justify-evenly bg-slant p-md rounded-md rounded-tr-md">
      <Box className="d-flex justify-center md:justify-start items-center md:w-1/2">
        <ButtonGroup className="mr-sm">
          <Button onClick={() => prevPage()}>
            <FaArrowLeft /><span className="VisuallyHidden">Previous page</span>
          </Button>
          <Button onClick={() => nextPage()}>
            <FaArrowRight /><span className="VisuallyHidden">Next page</span>
          </Button>
        </ButtonGroup>
        Page {pageIndex+1} of {pageCount}
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
        <IconButton onClick={el => setSearchVal('')}><FaTimesCircle /></IconButton>
      </Box>
    </Box>
  )
}

const SortableTH = ({
  colId,
  direction = null,
  defaultDirection = null,
  updateSorting,
  children,
}) => {
  return (
    <TH className="relative">
      <div className="relative d-flex items-center px-sm hover:bg-inset">
        <div className="grow mr-xs">
          {children}
        </div>
        <SortingDisplay state={direction} />
        <button
          onClick={() => updateSorting(colId, direction, defaultDirection)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0,
            background: 'transparent',
            color: 'inherit',
          }}
        />
      </div>
    </TH>
  )
}

const PAGINATION_LIMIT = 100

const calcPageCount = (count, limit) => Math.ceil(count / limit)
const calcPageIndex = (limit, offset) => Math.ceil(offset / limit)

export default function NftCollectionsPage({ initialNftCollectionsData }) {
  const [pageCount, setPageCount] = useState(
    calcPageCount(initialNftCollectionsData.meta.count, initialNftCollectionsData.meta.limit)
  )
  const [pageIndex, setPageIndex] = useState(
    calcPageIndex(initialNftCollectionsData.meta.limit, initialNftCollectionsData.meta.offset)
  )
  const nextPage = () => setPageIndex(pageIndex+1 < pageCount ? pageIndex + 1 : pageIndex)
  const prevPage = () => setPageIndex(pageIndex > 0 ? pageIndex - 1 : pageIndex)

  const [filters, setFilters] = useState(initialNftCollectionsData.meta.filters)

  const [sorting, setSorting] = useState({
    by: initialNftCollectionsData.meta.orderBy,
    dir: initialNftCollectionsData.meta.orderDirection,
  })
  const updateSorting = (colId, currDir, defaultDir) => {
    let dir = defaultDir || 'DESC'
    if (colId === sorting.by) {
      if (currDir === 'ASC') dir = 'DESC'
      else if (currDir === 'DESC') dir = 'ASC'
      setSorting({ by: colId, dir: dir})
    } else {
      setSorting({ by: colId, dir })
    }
  }
  const getSortingForColId = colId => colId === sorting.by ? sorting.dir : null

  let url = `/api/nft-collections?limit=${PAGINATION_LIMIT}&offset=${pageIndex * PAGINATION_LIMIT}`
  Object.keys(filters).forEach(key => { url += `&${key}=${encodeURIComponent(filters[key])}` })
  url += '&orderBy=' + encodeURIComponent(`${sorting.dir === 'ASC' ? '+' : '-'}${sorting.by}`)
  const { data: nftCollections, isLoading } = useSWR(
    url,
    url => fetch(url).then((res) => res.json()),
    {
      revalidateOnMount: false,
      keepPreviousData: true,
      fallback: {
        [`/api/nft-collections?limit=${PAGINATION_LIMIT}&offset=0&orderBy=-marketCap`]: initialNftCollectionsData,
      },
    },
  )

  useEffect(() => {
    const {
      offset,
      limit,
      count,
      filters: newFilters,
      orderBy: newOrderBy,
      orderDirection: newOrderDirection
    } = nftCollections.meta
    const newPageCount = calcPageCount(count, limit)
    const newPageIndex = calcPageIndex(limit, offset)

    if (newPageCount !== pageCount) setPageCount(newPageCount)
    if (newPageIndex !== pageIndex) setPageIndex(newPageIndex)
    if (newFilters.q !== filters.q) setFilters(newFilters)
    if (newOrderBy !== sorting.by || newOrderDirection !== sorting.dir) {
      setSorting({ by: newOrderBy, dir: newOrderDirection })
    }
  }, [nftCollections])

  return (
    <>
      <Head>
        <title>Solplorer - NFT Collections</title>
      </Head>
      <main className="grow">
        <Container>
          <Panel>
            <TableActions
              pageIndex={pageIndex}
              pageCount={pageCount}
              prevPage={prevPage}
              nextPage={nextPage}
              setPageIndex={setPageIndex}
              filters={filters}
              setFilters={setFilters}
            />
            <Table className={clx({'opacity-50': isLoading, 'opacity-100': !isLoading}, 'transition-opacity')}>
              <THead>
                <TR>
                  <TH colSpan={5}>{' '}</TH>
                  <TH colSpan={3}>Price</TH>
                  <TH colSpan={3}>Volume</TH>
                  <TH colSpan={3}>Supply</TH>
                </TR>
                <TR>
                  <TH>#</TH>
                  <TH><Box className="VisuallyHidden">Image</Box></TH>
                  <SortableTH colId="name" defaultDirection="ASC" direction={getSortingForColId('name')} updateSorting={updateSorting}>Collection</SortableTH>
                  <TH><Box className="VisuallyHidden">Links</Box></TH>
                  <SortableTH colId="marketCap" direction={getSortingForColId('marketCap')} updateSorting={updateSorting}>Market Cap.</SortableTH>
                  <SortableTH colId="price.floor" direction={getSortingForColId('price.floor')} updateSorting={updateSorting}>Floor</SortableTH>
                  <SortableTH colId="price.avg" direction={getSortingForColId('price.avg')} updateSorting={updateSorting}>Avg</SortableTH>
                  <SortableTH colId="price.max" direction={getSortingForColId('price.max')} updateSorting={updateSorting}>High</SortableTH>
                  <SortableTH colId="volume.1h" direction={getSortingForColId('volume.1h')} updateSorting={updateSorting}>1h</SortableTH>
                  <SortableTH colId="volume.24h" direction={getSortingForColId('volume.24h')} updateSorting={updateSorting}>1d</SortableTH>
                  <SortableTH colId="volume.7day" direction={getSortingForColId('volume.7day')} updateSorting={updateSorting}>7d</SortableTH>
                  <SortableTH colId="supply.listed" direction={getSortingForColId('supply.listed')} updateSorting={updateSorting}>Listed</SortableTH>
                  <SortableTH colId="supply.holders" direction={getSortingForColId('supply.holders')} updateSorting={updateSorting}>Holders</SortableTH>
                  <SortableTH colId="supply.total" direction={getSortingForColId('supply.total')} updateSorting={updateSorting}>Total</SortableTH>
                </TR>
              </THead>
              <TBody>
                {nftCollections.data.map(collection => (
                  <TR key={collection.hyperspace_id}>
                    <TD>{collection.rank}</TD>
                    <TD className="sticky left-0">
                      <Box className="d-flex p-xs">
                        <Box style={{ width: '48px', height: '48px', overflow: 'hidden' }}>
                          <Image
                            alt={collection.name}
                            src={`https://ckaumumkea.cloudimg.io/${collection.imageUrl}?w=128&q=80`}
                            className="rounded mr-sm"
                            width={48}
                            height={48}
                          />
                        </Box>
                      </Box>
                    </TD>
                    <TD className="md:sticky" style={{ left: '58px' }}>
                      <Box
                        className="overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{ maxWidth: '24ch' }}
                      >
                        {collection.name}
                      </Box>
                    </TD>
                    <TD>
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
                    </TD>
                    <TD><CurrencyDisplay currency="USD" short val={collection.marketCap} /></TD>
                    <TD>
                      <NumberDisplay prefix="◎ "  val={collection.price.floor} />
                      {' '}
                      <ChangeDisplay percent val={collection.price.floorChangePercent_24h} />
                    </TD>
                    <TD>
                      <NumberDisplay prefix="◎ "  val={collection.price.avg} />
                      {' '}
                      <ChangeDisplay percent val={collection.price.avgChangePercent_24h} />
                    </TD>
                    <TD><NumberDisplay prefix="◎ " val={collection.price.max} /></TD>
                    <TD><CurrencyDisplay currency="USD" short val={collection.volume['1h']} /></TD>
                    <TD><CurrencyDisplay currency="USD" short val={collection.volume['24h']} /></TD>
                    <TD><CurrencyDisplay currency="USD" short val={collection.volume['7day']} /></TD>
                    <TD><NumberDisplay short val={collection.supply.listed} /></TD>
                    <TD><NumberDisplay short val={collection.supply.holders} /></TD>
                    <TD><NumberDisplay short val={collection.supply.total} /></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <div>
              <div className="my-md text-center">
                Data provided by<br />
                <a href="https://hyperspace.xyz/" target="_blank" rel="noreferrer">
                  <img alt="Hyperspace" src="/assets/images/hyperspace.svg" />
                </a>
              </div>
              <div className="text-center">
                Last updated: <DateDisplay val={new Date(nftCollections.updatedAt)} dateStyle="long" />
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
    initialNftCollectionsData: await request(`${process.env.API_URL}/nft-collections`).json()
  }}
}
