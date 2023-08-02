import { default as request } from 'got'

const handler = async (_, res) => {
  res.status(200).json(
    (await request(`${process.env.API_URL}/data/top10.json`).json() as any).data
  )
}

export default handler
