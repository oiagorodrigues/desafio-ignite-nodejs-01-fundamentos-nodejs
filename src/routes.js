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
        return res.writeHead(400).end(JSON.stringify(`Missing body attributes`))
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
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler(req, res) {
      const { id } = req.params
      const { title, description } = req.body

      const task = db.find('tasks', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify(`Task not found`))
      }

      const updatedTask = db.update('tasks', id, {
        ...task,
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date().toISOString()
      })

      return res.end(JSON.stringify(updatedTask))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler(req, res) {
      const { id } = req.params

      const removedTask = db.delete('tasks', id)

      if (!removedTask) {
        return res.writeHead(404).end(JSON.stringify(`Task not found`))
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler(req, res) {
      const { id } = req.params

      const task = db.find('tasks', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify(`Task not found`))
      }

      const completedTask = db.update('tasks', id, {
        ...task,
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })

      return res.end(JSON.stringify(completedTask))
    }
  }
]
