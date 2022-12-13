import request from 'got'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FaDiscord, FaTwitter, FaLink } from 'react-icons/fa'

import {
  Box,
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

export default function NftCollectionsPage({ nftCollectionsData }) {
  return (
    <>
      <Head>
        <title>Solplorer - NFT Collections</title>
      </Head>
      <main className="grow">
        <Container>
          <Grid columns={1}>
            <Panel>
              <Table>
                <THead>
                  <TR>
                    <TH colSpan={4}>{' '}</TH>
                    <TH colSpan={3}>Price</TH>
                    <TH colSpan={3}>Volume</TH>
                    <TH colSpan={3}>Supply</TH>
                  </TR>
                  <TR>
                    <TH>#</TH>
                    <TH>Collection</TH>
                    <TH><Box className="VisuallyHidden">Links</Box></TH>
                    <TH>Market Cap.</TH>
                    <TH>Floor</TH>
                    <TH>Avg</TH>
                    <TH>High</TH>
                    <TH>1h</TH>
                    <TH>24h</TH>
                    <TH>7d</TH>
                    <TH>Listed</TH>
                    <TH>Holders</TH>
                    <TH>Total</TH>
                  </TR>
                </THead>
                <TBody>
                  {nftCollectionsData.data.map((collection, n) => (
                    <TR key={collection.hyperspace_id}>
                      <TD>{n + 1}</TD>
                      <TD>
                        <Box
                          className="d-flex items-center py-xs overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{ maxWidth: '28ch' }}
                        >
                            <Image
                              alt={collection.name}
                              src={`https://ckaumumkea.cloudimg.io/${collection.imageUrl}?w=128&q=80`}
                              className="rounded mr-sm overflow-hidden"
                              width={48}
                              height={48}
                            />
                            {' '}
                            {collection.name}
                        </Box>
                      </TD>
                      <TD>
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
                      </TD>
                      <TD>
                        <CurrencyDisplay currency="USD" short val={collection.marketCap} />
                      </TD>
                      <TD>
                        <NumberDisplay prefix="◎ "  val={collection.price.floor} />
                        {' '}
                        <ChangeDisplay percent val={collection.price.floorChangePercent_24h} />
                      </TD>
                      <TD>
                        <NumberDisplay prefix="◎ " val={collection.price.avg} />
                        {' '}
                        <ChangeDisplay percent val={collection.price.avgChangePercent_24h} />
                      </TD>
                      <TD>
                        <NumberDisplay prefix="◎ " val={collection.price.max} />
                      </TD>
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
          </Grid>
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
