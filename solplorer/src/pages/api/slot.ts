import { default as request } from 'got'

const handler = async (_, res) => {
  res.status(200).json(
    await request(`${process.env.API_URL}/solana/stats`).json()
  )
}

export default handler
