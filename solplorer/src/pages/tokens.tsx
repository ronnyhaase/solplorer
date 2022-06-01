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
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  DateDisplay,
} from '../components'

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
                <>
                <Table>
                  <THead>
                    <TR>
                      <TH>#</TH>
                      <TH>Symbol</TH>
                      <TH>Name</TH>
                      <TH>Price</TH>
                      <TH>Volume</TH>
                      <TH>Market Cap.</TH>
                      <TH>Supply (Circ. / Total)</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {tokenData.coins.map((token, n) => (
                      <TR key={token.id}>
                        <TD className="text-center">
                          {n + 1}
                        </TD>
                        <TD>
                          <div className="d-flex items-center">
                            <Image alt={`${token.name} Logo`} src={token.imageUrl} layout="raw" width={16} height={16} />
                            <span>&nbsp;{token.symbol.toUpperCase()}</span>
                          </div>
                        </TD>
                        <TD>
                          {token.name}
                        </TD>
                        <TD>
                          <CurrencyDisplay val={token.price} />
                          {' '}
                          <ChangeDisplay percent val={token.priceChangePercent_24h} />
                        </TD>
                        <TD>
                          <NumberDisplay short val={token.volume} />
                        </TD>
                        <TD>
                          <NumberDisplay short val={token.marketCap} />
                          {' '}
                          <ChangeDisplay percent val={token.marketCapChangePercent_24h} />
                        </TD>
                        <TD>
                          <NumberDisplay short val={token.supplyCirculating} />
                          {' '}/{' '}
                          <NumberDisplay short val={token.supplyTotal} />
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
                <div>
                  <div className="d-flex items-center justify-center my-md">
                    <span>Data provided by</span>
                    <a href="https://www.coingecko.com" className="d-flex">
                      <img alt="CoinGecko" src="/assets/images/coingecko.svg" />
                    </a>
                  </div>
                  <div className="text-center">
                    Last updated: <DateDisplay val={new Date(tokenData.updatedAt)} dateStyle="long" />
                  </div>
                </div>
              </>) : null}
            </Panel>
          </Grid>
        </Container>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  return { props: {
    tokenData: await request(`${process.env.API_URL}/solana/coins`).json()
  }}
}
