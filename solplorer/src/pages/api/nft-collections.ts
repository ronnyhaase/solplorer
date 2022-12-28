import request from 'got'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let searchParams = new URLSearchParams()
  Object.keys(req.query)
    .forEach(key => searchParams.append(key, req.query[key] as string))

  res.status(200).json(
    (await request(`${process.env.API_URL}/nft-collections`, { searchParams }).json())
  )
}
