import { default as request } from 'got'
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
                <Table>
                  <THead>
                    <TR>
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
              ) : null}
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
