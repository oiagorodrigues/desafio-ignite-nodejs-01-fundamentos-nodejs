import fs from 'node:fs/promises';

const dbPath = new URL('db.json', import.meta.url)

export class Database {
  #database = {}

  #persist() {
    fs.writeFile(dbPath, JSON.stringify(this.#database))
  }

  constructor() {
    fs.readFile(dbPath, 'utf-8')
      .then(data => (this.#database = JSON.parse(data)))
      .catch(() => (this.#persist()))
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  select(table, query) {
    let data = this.#database[table] ?? []

    if (query) {
      data = data.filter(row => {
        return Object.entries(query).some(([key, value]) => {
            return row[key].toLowerCase().includes(value.toLowerCase())
          })
      })
    }

    return data
  }

  find(table, id) {
    const data = this.#database[table].find(row => row.id === id)
    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (!rowIndex) return

    this.#database[table][rowIndex] = { id, ...data }
    this.#persist()
    return this.#database[table][rowIndex]
  }
}
