import request from 'got'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaDiscord, FaTwitter, FaLink, FaArrowLeft, FaArrowRight, FaSearch } from 'react-icons/fa'
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
} from '../components'

const TableActions = ({ pageIndex, pageCount, prevPage, nextPage }) => {
  const [searchVal, setSearchVal] = useState('')

  // useDebounce(() => {
  //   actions.setFilters({ search: searchVal })
  // }, 500, [searchVal])

  return (
    <Box className="d-flex flex-col md:flex-row justify-evenly bg-slant p-md rounded-md rounded-tr-md">
      <Box className="d-flex items-center md:w-1/2">
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
      </Box>
    </Box>
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

  const { data: nftCollections, isLoading } = useSWR(
    `/api/nft-collections?limit=${PAGINATION_LIMIT}&offset=${pageIndex * PAGINATION_LIMIT}`,
    url => fetch(url).then((res) => res.json()),
    {
      keepPreviousData: true,
      fallback: {
        [`/api/nft-collections?limit=${PAGINATION_LIMIT}&offset=0`]: initialNftCollectionsData,
      },
    },
  )

  useEffect(() => {
    const { offset, limit, count } = nftCollections.meta
    const pageCount = calcPageCount(count, limit)
    const pageIndex = calcPageIndex(limit, offset)

    setPageCount(pageCount)
    setPageIndex(pageIndex)
  }, [nftCollections])

  return (
    <>
      <Head>
        <title>Solplorer - NFT Collections</title>
      </Head>
      <main className="grow">
        <Container>
          <Panel>
            {true ? (<>
            <TableActions pageIndex={pageIndex} pageCount={pageCount} prevPage={prevPage} nextPage={nextPage} />
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
                  <TH id="name" sortable defaultSortingDirection="ASC">Collection</TH>
                  <TH><Box className="VisuallyHidden">Links</Box></TH>
                  <TH id="marketCap" sortable>Market Cap.</TH>
                  <TH id="price.floor" sortable>Floor</TH>
                  <TH id="price.avg" sortable>Avg</TH>
                  <TH id="price.max" sortable>High</TH>
                  <TH id="volume.1h" sortable>1h</TH>
                  <TH id="volume.24h" sortable>1d</TH>
                  <TH id="volume.7d" sortable>7d</TH>
                  <TH id="supply.listed" sortable>Listed</TH>
                  <TH id="supply.holders" sortable>Holders</TH>
                  <TH id="supply.total" sortable>Total</TH>
                </TR>
              </THead>
              <TBody>
                {nftCollections.data.map(collection => (
                  <TR key={collection.hyperspace_id}>
                    <TD>{collection.rank}</TD>
                    <TD>
                      <Box className="d-flex py-xs">
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
                    <TD>
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
                    <TD><CurrencyDisplay currency="USD" short val={collection.volume['7d']} /></TD>
                    <TD><NumberDisplay short val={collection.supply.listed} /></TD>
                    <TD><NumberDisplay short val={collection.supply.holders} /></TD>
                    <TD><NumberDisplay short val={collection.supply.total} /></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <div>
              <div className="d-flex items-center justify-center my-md">
                <span>Data provided by</span>
                <a href="https://hyperspace.xyz/" className="d-flex">
                  <img alt="Hyperspace" src="/assets/images/hyperspace.svg" />
                </a>
              </div>
              <div className="text-center">
                Last updated: <DateDisplay val={new Date(nftCollections.updatedAt)} dateStyle="long" />
              </div>
            </div></>) : null}
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
