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
  THSortable,
  THead,
  TR,
  TD,
  TH,
} from '../components'
import { sortTableData } from '../components/table/helper'

export default function Tokens() {
  const { data: tokenData } = useSWR('api/tokens', url => fetch(url).then((res) => res.json()))

  const [tokens, setTokens] = useState(tokenData ? tokenData.data : null)
  useEffect(() => {
    if (tokenData) setTokens(tokenData.data)
  }, [tokenData])

  const [sorting, _setSorting] = useState({
    by: 'marketCap',
    dir: 'DESC',
  })
  const setSorting = ({ by, dir }: { by: string, dir: string }) => {
    if (by !== sorting.by || dir != sorting.dir) {
      _setSorting({ by, dir})
    }
  }
  useEffect(() => {
    if (tokens) setTokens(sortTableData(tokens, sorting.by, sorting.dir as any))
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
        <title>Solplorer - Tokens</title>
      </Head>
      <main className="grow">
        <Container>
          {(tokenData && tokens) ? (<Grid columns={1}>
            <Panel>
              <Table>
                <THead>
                  <TR>
                    <TH>#</TH>
                    <PreparedTHSortable colId="symbol" defaultDir="ASC">Symbol</PreparedTHSortable>
                    <PreparedTHSortable colId="name" defaultDir="ASC">Name</PreparedTHSortable>
                    <PreparedTHSortable colId="price.current">Price</PreparedTHSortable>
                    <PreparedTHSortable colId="volume.current">Volume</PreparedTHSortable>
                    <PreparedTHSortable colId="marketCap">Market Cap.</PreparedTHSortable>
                    <TH>Supply (Circ. / Total)</TH>
                    <PreparedTHSortable colId="fdv">FDV</PreparedTHSortable>
                  </TR>
                </THead>
                <TBody>
                  {tokens.map((token, n) =>(
                    <TR key={token.cmc.id}>
                      <TD>{n + 1}</TD>
                      <TD className="sticky px-sm" style={{ left: 0 }}>
                        <div className="d-flex items-center">
                          <Image
                            alt={`${token.name} Logo`}
                            src={'/assets/images/logo.png'}
                            width={16}
                            height={16}
                            className="overflow-hidden"
                          />
                          <span>&nbsp;{token.symbol}</span>
                        </div>
                      </TD>
                      <TD>
                        <div
                          style={{ maxWidth: '24ch' }}
                          className="overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                          {token.name}
                        </div>
                      </TD>
                      <TD>
                        <CurrencyDisplay currency="USD" maxDecimals={3} val={token.price.current} />
                        {' '}
                        <ChangeDisplay percent val={token.price.changePercent_24h} />
                      </TD>
                      <TD>
                        <CurrencyDisplay currency="USD" short val={token.volume.current} />
                        {' '}
                        <ChangeDisplay percent val={token.volume.changePercent_24h} />
                      </TD>
                      <TD>
                        <CurrencyDisplay currency="USD" short val={token.marketCap} />
                      </TD>
                      <TD>
                        <NumberDisplay short val={token.supply.circulating} />
                        {' '}/{' '}
                        <NumberDisplay short val={token.supply.total} />
                      </TD>
                      <TD><NumberDisplay short val={token.fdv} /></TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
              <div>
                <div className="my-md text-center">
                  Data provided by<br />
                  <a href="https://coinmarketcap.com/view/solana-ecosystem/" target="_blank" rel="noreferrer">
                    <img alt="CoinMarketCap" src="/assets/images/cmc.svg" />
                  </a>
                </div>
                <div className="text-center">
                  Last updated: <DateDisplay val={new Date(tokenData.updatedAt)} dateStyle="long" />
                </div>
              </div>
            </Panel>
          </Grid>) : (<LoadingSpinner />)}
        </Container>
      </main>
    </>
  )
}
