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
}
