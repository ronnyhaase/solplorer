import clx from 'classnames'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaDiscord, FaTwitter, FaLink, FaArrowLeft, FaArrowRight, FaSearch, FaTimesCircle } from 'react-icons/fa'
import useDebounce from 'react-use/lib/useDebounce'
import useSWR from 'swr'

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
  THead,
  TBody,
  Table,
  TD,
  IconButton,
  LoadingSpinner,
  THSortable,
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

const PAGINATION_LIMIT = 100

const calcPageCount = (count, limit) => Math.ceil(count / limit)
const calcPageIndex = (limit, offset) => Math.ceil(offset / limit)

export default function NftCollectionsPage() {
  const [pageCount, setPageCount] = useState(
    calcPageCount(100, 100)
  )
  const [pageIndex, setPageIndex] = useState(
    calcPageIndex(100, 0)
  )
  const nextPage = () => setPageIndex(pageIndex+1 < pageCount ? pageIndex + 1 : pageIndex)
  const prevPage = () => setPageIndex(pageIndex > 0 ? pageIndex - 1 : pageIndex)

  const [filters, setFilters] = useState({})

  const [sorting, _setSorting] = useState({
    by: 'marketCap',
    dir: 'DESC',
  })
  const setSorting = ({ by, dir }: { by: string, dir: string }) => {
    if (by !== sorting.by || dir != sorting.dir) {
      _setSorting({ by, dir})
    }
  }
  const createSortChangeHandler = (
    colId, opts = { defaultDir: 'DESC' }
  ) => function handleSortChange() {
    let dir
    if (colId === sorting.by) {
      if (sorting.dir === 'ASC') dir = 'DESC'
      else if (sorting.dir === 'DESC') dir = 'ASC'
    } else {
      dir = opts.defaultDir || 'DESC'
    }
    setSorting({ by: colId, dir })
  }
  const getSortingFor = colId => colId === sorting.by ? sorting.dir : null
  const PreparedTHSortable = ({ colId, defaultDir = null, children }) => (
    <THSortable
      direction={getSortingFor(colId)}
      onSortChange={createSortChangeHandler(colId, { defaultDir })}
    >
      {children}
    </THSortable>
  )

  let url = `/api/nft-collections?limit=${PAGINATION_LIMIT}&offset=${pageIndex * PAGINATION_LIMIT}`
  Object.keys(filters)
    .forEach(key => { url += `&${key}=${encodeURIComponent(filters[key])}` })
  url += '&orderBy=' + encodeURIComponent(`${sorting.dir === 'ASC' ? '+' : '-'}${sorting.by}`)

  const { data: nftCollections, isLoading } = useSWR(
    url,
    url => fetch(url).then((res) => res.json()),
    {
      keepPreviousData: true,
    },
  )

  useEffect(() => {
    if (!nftCollections) return

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
    if (newFilters.q !== (filters as any).q) setFilters(newFilters)
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
          {nftCollections ? (<Panel>
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
                  <PreparedTHSortable colId="name" defaultDir="ASC">Collection</PreparedTHSortable>
                  <TH><Box className="VisuallyHidden">Links</Box></TH>
                  <PreparedTHSortable colId="marketCap">Market Cap.</PreparedTHSortable>
                  <PreparedTHSortable colId="price.floor">Floor</PreparedTHSortable>
                  <PreparedTHSortable colId="price.avg">Avg</PreparedTHSortable>
                  <PreparedTHSortable colId="price.max">High</PreparedTHSortable>
                  <PreparedTHSortable colId="volume.1h">1h</PreparedTHSortable>
                  <PreparedTHSortable colId="volume.24h">1d</PreparedTHSortable>
                  <PreparedTHSortable colId="volume.7day">7d</PreparedTHSortable>
                  <PreparedTHSortable colId="supply.listed">Listed</PreparedTHSortable>
                  <PreparedTHSortable colId="supply.holders">Holders</PreparedTHSortable>
                  <PreparedTHSortable colId="supply.total">Total</PreparedTHSortable>
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
                            src={'/assets/images/logo.png'}
                            quality={80}
                            width={48}
                            height={48}
                            className="rounded mr-sm"
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
          </Panel>) : (<LoadingSpinner />)}
        </Container>
      </main>
    </>
  )
}
