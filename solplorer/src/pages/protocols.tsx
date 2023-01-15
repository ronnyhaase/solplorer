import request from 'got'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import {
  ChangeDisplay,
  Container,
  CurrencyDisplay,
  DateDisplay,
  Grid,
  LoadingSpinner,
  NumberDisplay,
  Panel,
  Table,
  TBody,
  TD,
  THead,
  THSortable,
  TR,
} from '../components'
import { sortTableData } from '../components/table-renderer/helper'

export default function Protocols() {
  const { data: tvlData } = useSWR('api/tvl', url => fetch(url).then((res) => res.json()))

  const [protocols, setProtocols] = useState(tvlData ? tvlData.data.protocols : null)
  useEffect(() => {
    if (tvlData) setProtocols(tvlData.data.protocols)
  }, [tvlData])

  const [sorting, _setSorting] = useState({
    by: 'tvl.current',
    dir: 'DESC',
  })
  const setSorting = ({ by, dir }: { by: string, dir: string }) => {
    if (by !== sorting.by || dir != sorting.dir) {
      _setSorting({ by, dir})
    }
  }
  useEffect(() => {
    if (protocols) setProtocols(sortTableData(protocols, sorting.by, sorting.dir as any))
  }, [sorting, sorting.by, sorting.dir])

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

  return (
    <>
      <Head>
        <title>Solplorer - TVL &amp; Protocols</title>
      </Head>
      <main>
        <Container>
          {(tvlData && protocols) ? (<Grid columns={1}>
            <Panel>
              {protocols ? (
                <Table>
                  <THead>
                    <TR>
                      <PreparedTHSortable colId="symbol" defaultDir="ASC">Symbol</PreparedTHSortable>
                      <PreparedTHSortable colId="name" defaultDir="ASC">Name</PreparedTHSortable>
                      <PreparedTHSortable colId="category" defaultDir="ASC">Category</PreparedTHSortable>
                      <PreparedTHSortable colId="tvl.current">TVL</PreparedTHSortable>
                      <PreparedTHSortable colId="tvl.dominancePercent">Dominance</PreparedTHSortable>
                      <PreparedTHSortable colId="marketCap">Market Cap.</PreparedTHSortable>
                    </TR>
                  </THead>
                  <TBody>
                    {protocols.map(protocol => (
                      <TR key={protocol.name}>
                        <TD className="sticky px-sm" style={{ left: 0 }}>
                          <div className="d-flex items-center leading-none">
                            <div style={{ width: '16px', height: '16px', overflow: 'hidden' }}>
                              <Image
                                alt={`${protocol.name} Logo`}
                                src={protocol.imageUrl}
                                quality={80}
                                width={16}
                                height={16}
                              />
                            </div>
                            <span>&nbsp;{(protocol.symbol || '').toUpperCase()}</span>
                          </div>
                        </TD>
                        <TD>{protocol.name}</TD>
                        <TD>{protocol.category}</TD>
                        <TD>
                          <CurrencyDisplay short val={protocol.tvl.current} />
                          {' '}
                          <ChangeDisplay percent val={protocol.tvl.change_24h} />
                        </TD>
                        <TD>
                          <NumberDisplay val={protocol.tvl.dominancePercent} suffix=" %" />
                        </TD>
                        <TD>
                          <CurrencyDisplay short val={protocol.marketCap} />
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              ) : null}
              <div>
                <div className="my-md text-center">
                  Data provided by<br />
                  <a href="https://defillama.com" target="_blank" rel="noreferrer">
                    <img alt="DefiLlama" src="/assets/images/defillama.svg" />
                  </a>
                </div>
                <div className="text-center">
                  Last updated: <DateDisplay val={new Date(tvlData.updatedAt)} dateStyle="long" />
                </div>
              </div>
            </Panel>
          </Grid>) : (<LoadingSpinner />)}
        </Container>
      </main>
    </>
  )
}
