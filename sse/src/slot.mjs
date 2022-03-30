import 'dotenv/config'
import * as http from 'http'
import { Connection, clusterApiUrl } from '@solana/web3.js'


const client = new Connection(
  process.env.API_URL
    ? process.env.API_URL + (process.env.API_KEY
      ? `/apikey/${process.env.API_KEY}`
      : '')
    : clusterApiUrl('mainnet-beta')
)

let consumers = []
let lastSlot = null

client.onSlotChange(slot => {
  lastSlot = slot
  consumers.forEach((consumer) => consumer.send(slot))
})

http.createServer((req, res) => {
  if (!req.headers.accept.startsWith('text/event-stream')) {
    const response = JSON.stringify(lastSlot)
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': response.length,
      'Cache-Control': 'no-cache',
    }).write(response)
    return
  }

  const id = Date.now()
  consumers.push({ id, send: (slot) => res.write(`data: ${JSON.stringify(slot)}\n\n`) })
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  console.log(`Consumer ${id} connected`)

  req.on('close', () => {
    consumers = consumers.filter(consumer => consumer.id !== id)
    console.log(`Consumer ${id} disconnected`)
  })
}).listen(parseInt(process.env.PORT))
