import Image from 'next/image'
import Link from 'next/link'
import { FaDiscord, FaLink, FaTwitter } from 'react-icons/fa'

import { Box, ChangeDisplay, CurrencyDisplay, NumberDisplay, Panel, Table, TBody, TD, TH, THead, TR } from '../../components'

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
            <TD _className="sticky" _style={{ left: 0 }}>{n + 1}</TD>
            <TD className="sticky" style={{ left: 0 }}>
            <Box
              className="d-flex items-center py-xs overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ maxWidth: '28ch' }}
            >
                <Image
                  alt={collection.name}
                  src={collection.imageUrl}
                  quality={80}
                  width={32}
                  height={32}
                  className="rounded mr-sm"
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
              <CurrencyDisplay currency="USD" short val={collection.volume['1h']} />
            </TD>
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

export default Top10
