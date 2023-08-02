import request from 'got'
import { get } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   let searchParams = new URLSearchParams()
//   Object.keys(req.query)
//     .forEach(key => searchParams.append(key, req.query[key] as string))

//   res.status(200).json(
//     (await request(`${process.env.API_URL}/nft-collections`, { searchParams }).json())
//   )
// }

function buildResponse(rawData, query) {
  let data = rawData.data;
  let orderBy = 'marketCap';
  let orderDirection = 'DESC';
  let filters: any = {};

  // Search
  if (query.q) {
    filters.q = query.q;
    data = data.filter(collection => {
      return collection.name && collection.name.toLowerCase().indexOf(query.q.toLowerCase()) !== -1;
    });
  }

  // Sorting
  if (query.orderBy && query.orderBy !== '-marketCap') {
    orderBy = query.orderBy.slice(1);
    orderDirection = query.orderBy[0] === '+' ? 'ASC' : 'DESC';

    data = data.sort((colA, colB) => {
      let a = get(colA, orderBy);
      let b = get(colB, orderBy);

      if (a === null && typeof b === 'number') a = Number.MIN_SAFE_INTEGER;
      if (a === null && typeof b === 'string') a = String.fromCodePoint(0x10ffff);
      if (typeof a === 'number' && b === null) b = Number.MIN_SAFE_INTEGER;
      if (typeof a === 'string' && b === null) b = String.fromCodePoint(0x10ffff);

      if (a < b) return (orderDirection === 'ASC') ? -1 : 1
      else if (a > b) return (orderDirection === 'ASC') ? 1 : -1
      else return 0;
    })
  }

  // Pagination
  const limit = query.limit || 100;
  const offset = query.offset || 0;
  const count = data.length;
  data = data.slice(offset, offset + limit);

  return {
    meta: { offset, limit, count, orderBy, orderDirection, filters },
    data,
    count,
    type: "list",
    updatedAt: rawData.updatedAt,
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const nfts = await request(`${process.env.API_URL}/data/nft-collections.json`).json()

  res.status(200).json(buildResponse(nfts, req.query))
}

export default handler
