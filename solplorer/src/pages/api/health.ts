import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' || req.method === 'HEAD') res.status(200).send('')
  else res.status(405).send('')
}

export default handler
