import fs from 'node:fs/promises'
import http from 'node:http'
import { parse } from 'csv-parse'

(async function csvAsyncIterator() {
  const csvPath = new URL('example.csv', import.meta.url)
  const csv = await fs.readFile(csvPath, 'utf-8')

  const records = parse(csv, {
    columns: true,
    skipEmptyLines: true
  })

  for await (const record of records) {
    const req = http.request('http://localhost:3333/tasks', { method: 'POST' })
    req.write(JSON.stringify(record))
    req.end()

    console.log('request with record', record)
  }
})()
