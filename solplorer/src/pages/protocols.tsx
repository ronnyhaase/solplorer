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
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from '../components'
import defillamaImg from '../../public/defillama.svg'

export default function Protocols({ tvlData }) {
  return (
    <>
      <Head>
        <title>Solplorer - TVL &amp; Protocols</title>
      </Head>
      <main>
        <Container>
          <Grid columns={1}>
            <Panel>
              {tvlData ? (
                <Table>
                  <THead>
                    <TR>
                      <TH>Symbol</TH>
                      <TH>Name</TH>
                      <TH>Category</TH>
                      <TH>TVL</TH>
                      <TH>Dominance</TH>
                      <TH>Market Cap.</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {tvlData.protocols.map(protocol => (
                      <TR key={protocol.name}>
                        <TD>
                        <div className="d-flex items-center">
                            <Image alt={`${protocol.name} Logo`} src={protocol.imageUrl} layout="raw" width={16} height={16} />
                            <span>&nbsp;{protocol.symbol.toUpperCase()}</span>
                          </div>
                        </TD>
                        <TD>
                          {protocol.name}
                        </TD>
                        <TD>
                          {protocol.category}
                        </TD>
                        <TD>
                          <CurrencyDisplay short val={protocol.tvl} />
                          {' '}
                          <ChangeDisplay percent val={protocol.change_24h} />
                        </TD>
                        <TD>
                          <NumberDisplay val={protocol.dominancePercent} suffix=" %" />
                        </TD>
                        <TD>
                          <CurrencyDisplay short val={protocol.marketCap} />
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                  <tfoot>
                    <tr>
                      <td colSpan={6}>
                        <div>
                          <div className="d-flex items-center justify-center my-md">
                            <span>Data provided by</span>
                            <a href="https://defillama.com/" className="d-flex">
                              <img alt="DefiLlama" src="/assets/images/defillama.svg" />
                            </a>
                          </div>
                          <div className="text-center">
                            Last updated: <DateDisplay val={new Date(tvlData.updatedAt)} dateStyle="long" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
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
    tvlData: await request(`${process.env.API_URL}/solana/tvl`).json()
  }}
}
