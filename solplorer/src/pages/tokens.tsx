import { default as request } from 'got'
import Head from 'next/head'
import Image from 'next/image'

import { ChangeDisplay, Container, CurrencyDisplay, Grid, NumberDisplay, Panel } from '../components'

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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm md:text-md whitespace-nowrap">
                    <thead className="text-muted">
                      <tr>
                        <th className="text-center">Symbol</th>
                        <th className="text-center">Name</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Volume</th>
                        <th className="text-center">Market Cap.</th>
                        <th className="text-center">Supply (Circ. / Total)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokenData.coins.map((token, n) => (
                        <tr key={token.id} className={n % 2 ? null : 'bg-background'}>
                          <td className="py-xs px-sm">
                            <div className="d-flex items-center">
                              <Image alt={`${token.name} Logo`} src={token.imageUrl} layout="raw" width={16} height={16} />
                              <span>&nbsp;{token.symbol.toUpperCase()}</span>
                            </div>
                          </td>
                          <td className="py-xs px-sm">{token.name}</td>
                          <td className="py-xs px-sm">
                            <CurrencyDisplay val={token.price} />
                            {' '}
                            <ChangeDisplay percent val={token.priceChangePercent_24h} />
                          </td>
                          <td className="py-xs px-sm">
                            <NumberDisplay short val={token.volume} />
                          </td>
                          <td className="py-xs px-sm">
                            <NumberDisplay short val={token.marketCap} />
                            {' '}
                            <ChangeDisplay percent val={token.marketCapChangePercent_24h} />
                          </td>
                          <td className="py-xs px-sm">
                            <NumberDisplay short val={token.supplyCirculating} />
                            {' '}/{' '}
                            <NumberDisplay short val={token.supplyTotal} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
