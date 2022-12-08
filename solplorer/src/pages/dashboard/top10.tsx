import Link from 'next/link'
import { FaDiscord, FaLink, FaTwitter } from 'react-icons/fa'

import { Box, ChangeDisplay, NumberDisplay, Panel, Table, TBody, TD, TH, THead, TR } from '../../components'

const Top10 = ({ top10Data }) => (
  <Panel>
    <h2 className="m-0 mt-md mb-xl text-center">Top 10 NFT collections last hour</h2>
    {!top10Data ? 'Loading...' : (<Table>
      <THead>
        <TR>
          <TH>#</TH>
          <TH>Collection</TH>
          <TH><Box className="VisuallyHidden">Links</Box></TH>
          <TH>Volume (1h)</TH>
          <TH>Floor</TH>
          <TH>High</TH>
        </TR>
      </THead>
      <TBody>
        {top10Data.nfts.map((collection, n) => (
          <TR key={collection.hyperspace_id}>
            <TD>{n + 1}</TD>
            <TD>
              <Box
                className="overflow-hidden text-ellipsis whitespace-nowrap"
                style={{ maxWidth: '20ch' }}
              >
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
            <TD><NumberDisplay short val={collection.volume['1h']} /></TD>
            <TD>
              <NumberDisplay prefix="◎ "  val={collection.price.floor} />
              {' '}
              <ChangeDisplay percent val={collection.price.floorChangePercent_24h} />
            </TD>
            <TD>
              <NumberDisplay prefix="◎ " val={collection.price.max} />
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>)}
  </Panel>
)

export { Top10 }