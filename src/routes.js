import { randomUUID } from 'node:crypto'

import { Database } from './database/index.js'
import { buildRoutePath } from './utils/build-route-path.js'

const db = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler(req, res) {
      if (req.body == null) {
        return res.writeHead(400).end(`Missing body attributes.`)
      }

      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: null,
        completed_at: null,
        title,
        description
      }

      db.insert('tasks', task)

      return res
        .writeHead(201)
        .end(JSON.stringify(task))
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler(req, res) {
      const { search } = req.query

      const tasks = db.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  }
]
