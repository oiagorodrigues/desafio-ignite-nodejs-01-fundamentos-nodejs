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
}
