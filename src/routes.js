import { randomUUID } from 'node:crypto'

import { Database } from './database/index.js'
import { buildRoutePath } from './utils/build-route-path.js'

const db = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler(req, res) {
      if (req.body === null) {
        return res.writeHead(400).end(JSON.stringify({
          message: `Missing body attributes`
        }))
      }

      const { title, description } = req.body

      if (!title) {
        return res.writeHead(400).end(JSON.stringify({
          message: `Title is required`
        }))
      }

      if (!description) {
        return res.writeHead(400).end(JSON.stringify({
          message: `Description is required`
        }))
      }

      const date = new Date().toISOString()
      const task = {
        id: randomUUID(),
        created_at: date,
        updated_at: date,
        completed_at: null,
        title,
        description
      }

      db.insert('tasks', task)

      return res
        .writeHead(201)
        .end(JSON.stringify({ data: task }))
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

      return res.end(JSON.stringify({ data: tasks }))
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler(req, res) {
      const { id } = req.params

      const task = db.find('tasks', id)

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({ message: `Task Not Found` })
        )
      }

      return res.end(JSON.stringify({ data: task }))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler(req, res) {
      const { id } = req.params
      const { title, description } = req.body

      if (!description && !title) {
        return res.writeHead(400).end(
          JSON.stringify({ message: `Missing task's title and description` })
        )
      }

      const task = db.find('tasks', id)

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({ message: `Task not found` })
        )
      }

      const updatedTask = db.update('tasks', id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date().toISOString()
      })

      return res.end(JSON.stringify({ data: updatedTask }))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler(req, res) {
      const { id } = req.params

      const task = db.find('tasks', id)

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({ message: `Task not found` })
        )
      }

      db.delete('tasks', id)

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
        return res.writeHead(404).end(
          JSON.stringify({ message: `Task not found` })
        )
      }

      const isTaskCompleted = !!task.completed_at
      const completed_at = !isTaskCompleted ? new Date().toISOString() : null

      const completedTask = db.update('tasks', id, { completed_at })

      return res.end(JSON.stringify({ data: completedTask }))
    }
  }
]
