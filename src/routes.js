import { randomUUID } from 'node:crypto'

import { Database } from './database/index.js'

const db = new Database()

export const routes = [
  {
    method: 'POST',
    url: '/tasks',
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
    url: '/tasks',
    handler(req, res) {
      const tasks = db.select('tasks')
      return res.end(JSON.stringify(tasks))
    }
  }
]
