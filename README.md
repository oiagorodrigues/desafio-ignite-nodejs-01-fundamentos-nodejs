# Desafio 01 - Ignite Nodejs - Fundamentos de Nodejs

Este é um desafio de projeto de API construído em Node.js usando apenas o pacote `node:http`. O objetivo deste projeto é fornecer um exemplo simples 
de como construir uma API RESTful sem o uso de bibliotecas ou frameworks adicionais. 

Utilizei um banco de dados `in memory` criando uma classe que oferece helpers para persistir os dados em um arquivo de texto salvo em `src/database/db.json`.

**BONUS**: Como desafio adicional, criei um arquivo a parte (fora da API) que, quando executado com `node src/csv/csv-async-iterator.js`, vai ler um arquivo *.csv* de exemplo e vai criar tarefas com base no seguinte template (salvo no arquivo):

```csv
title,description
Task 01,Descrição da Task 01
Task 02,Descrição da Task 02
Task 03,Descrição da Task 03
Task 04,Descrição da Task 04
Task 05,Descrição da Task 05
```

> Este desafio foi lançado no módulo 01 do curso de Nodejs da RocketSeat.

## Estrutura do projeto

```
src
---- csv
------ csv-async-iterator.js       - contém uma IIFE que vai ler o arquivo `example.csv` e criar tarefas em massa
------ example.csv                 - arquivo csv de exemplo
---- database
------ index.js                    - contém o service que vai persistir os dados no banco de dados
------ db.json                     - banco de dados in memory
---- middlewares
------ json                        - transforma a requisição salvando em req.body a stream passada na requisição
---- utils
------ build-route-path.js         - pega o `path` da rota e transforma os parâmetros dinâmicos em valores válidos
------ extract-query-params.js     - extrai os route params e route queries da rota
---- routes.js                     - contém todas as rotas (controllers) da api
---- server.js                     - contém a lógica da crição servidor
```

## Como executar o projeto

Certifique-se de ter o Node.js instalado em sua máquina.


Clone o repositório em sua máquina local.

```
  git clone git@github.com:oiagorodrigues/desafio-ignite-nodejs-01-fundamentos-nodejs.git
```


Abra o terminal e navegue até a pasta do projeto.


Instale as dependências do projeto e inicie o servidor.

```
npm install
npm run server
```

O servidor rodará na porta *3333*.

## Como utilizar a API

A API possui as seguintes rotas:

| Rota  | Descrição  | 
|---|---|
| [`POST /tasks`](#post-tasks) | Cria uma nova tarefa.  |
| [`GET /tasks`](#get-tasks)  |  Retorna todas as tarefas. |
| [`GET /tasks/:id`](#get-tasksid) | Retorna uma tarefa específica pelo seu ID. |
| [`PUT /tasks/:id`](#put-tasksid) | Atualiza uma tarefa existente. |
| [`DELETE /tasks/:id`](#delete-tasksid) | Deleta uma tarefa existente. |
| [`PATCH /tasks/:id/complete`](#patch-tasksidcomplete) | Marca uma tarefa como concluída. |

> O arquivo do [insomnia](https://github.com/oiagorodrigues/desafio-ignite-nodejs-01-fundamentos-nodejs/blob/main/Insomnia.json) é um json com a estrutura criada para testar as rotas. Basta importá-lo no seu [Insomnia](https://insomnia.rest/).

### POST /tasks

Cria uma nova tarefa com base nos dados enviados no corpo da requisição.

#### Corpo da Requisição


| Parâmetro  | Descrição  | 
|---|---|
| `title (string)` | Título da tarefa (obrigatório)  |
| `description (string)`  |  Descrição da tarefa (obrigatório). |

#### Exemplo de requisição

```http
POST /tasks HTTP/1.1
Content-Type: application/json

{
  "title": "Comprar pão",
  "description": "Ir ao mercado e comprar pão francês."
}
```

#### Exemplo de resposta

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "id": "e6ad76f6-9038-4154-9f4c-d6b5c3b5e5aa",
    "created_at": "2023-03-24T16:22:05.337Z",
    "updated_at": "2023-03-24T16:22:05.337Z",
    "completed_at": null,
    "title": "Comprar pão",
    "description": "Ir ao mercado e comprar pão francês."
  }
}
```

### GET /tasks

Retorna todas as tarefas.

#### Query


| Query  | Descrição  | 
|---|---|
| `search (string)` | Título da tarefa (opcional)  |

#### Exemplo de requisição

```http
GET /tasks HTTP/1.1
```

#### Exemplo de resposta


```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    {
      "id": "e6ad76f6-9038-4154-9f4c-d6b5c3b5e5aa",
      "created_at": "2023-03-24T16:22:05.337Z",
      "updated_at": "2023-03-24T16:22:05.337Z",
      "completed_at": null,
      "title": "Comprar pão",
      "description": "Ir ao mercado e comprar pão francês."
    },
    {
      "id": "b2ad76f6-9038-4154-9f4c-d6b5c3b5e5aa",
      "created_at": "2023-03-24T16:22:05.337Z",
      "updated_at": "2023-03-24T16:22:05.337Z",
      "completed_at": null,
      "title": "Fazer compras",
      "description": "Fazer as compras do mês"
    },
  ]
}
```
     
#### Exemplo de requisição com filtro

> Com a query `search` é possível fazer a busca filtrando tanto pelo título, quanto pela descrição

```http
GET /tasks?search=compras HTTP/1.1
```

#### Exemplo de resposta do filtro


```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    {
      "id": "e6ad76f6-9038-4154-9f4c-d6b5c3b5e5aa",
      "created_at": "2023-03-24T16:22:05.337Z",
      "updated_at": "2023-03-24T16:22:05.337Z",
      "completed_at": null,
      "title": "Comprar pão",
      "description": "Ir ao mercado e comprar pão francês."
    },
  ]
}
```


### GET /tasks/:id

Retorna uma tarefa específica pelo seu ID.

#### Parâmetros

| Parâmetro  | Descrição  | 
|---|---|
| `id (string)` | ID da tarefa (obrigatório)  |

#### Exemplo de requisição

```http
GET /tasks/e6ad76f6-9038-4154-9f4c-d6b5c3b5e5aa HTTP/1.1
```

#### Exemplo de resposta


```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    {
      "id": "e6ad76f6-9038-4154-9f4c-d6b5c3b5e5aa",
      "created_at": "2023-03-24T16:22:05.337Z",
      "updated_at": "2023-03-24T16:22:05.337Z",
      "completed_at": null,
      "title": "Comprar pão",
      "description": "Ir ao mercado e comprar pão francês."
    },
  ]
}
```



### PUT /tasks/:id

Atualiza uma tarefa existente.

> Apesar de ser utilizado o método PUT, por questões de definição de requisitos e para prática na construção da API utilizando esse método, é possível atualizar uma tarefa passando tanto o *título*, quanto a *descrição*.

#### Parâmetros

| Parâmetro  | Descrição  | 
|---|---|
| `id (string)` | ID da tarefa  |

#### Corpo da Requisição

| Parâmetro  | Descrição  | 
|---|---|
| `title (string)` | Título da tarefa  |
| `description (string)` | Descrição da tarefa  |

#### Requisitos

- É possível enviar apenas o título ou a descrição, porém não pode enviar nada.

#### Exemplo de requisição

```http
PUT /tasks/e6ad76f6-9038-4154-9f4c-d6b5c3b5e5aa HTTP/1.1

{
  "description": "Ir a padaria e comprar pão."
}
```

#### Exemplo de resposta


```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    {
      "id": "e6ad76f6-9038-4154-9f4c-d6b5c3b5e5aa",
      "created_at": "2023-03-24T16:22:05.337Z",
      "updated_at": "2023-03-24T17:00:05.337Z",
      "completed_at": null,
      "title": "Comprar pão",
      "description": "Ir a padaria e comprar pão."
    },
  ]
}
```



### DELETE /tasks/:id

Remove uma tarefa existente.

#### Parâmetros

| Parâmetro  | Descrição  | 
|---|---|
| `id (string)` | ID da tarefa  |


#### Exemplo de requisição

```http
DELETE /tasks/e6ad76f6-9038-4154-9f4c-d6b5c3b5e5aa HTTP/1.1
```

#### Exemplo de resposta


```http
HTTP/1.1 204 NO CONTENT
Content-Type: application/json
```



### PATCH /tasks/:id/complete

Marca uma tarefa existente como completa.

> É possível marcar ou desmarcar a tarefa como completa, batando enviar a requisição novamente.

#### Parâmetros

| Parâmetro  | Descrição  | 
|---|---|
| `id (string)` | ID da tarefa  |

#### Exemplo de requisição

```http
PATCH /tasks/e6ad76f6-9038-4154-9f4c-d6b5c3b5e5aa/complete HTTP/1.1
```

#### Exemplo de resposta


```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    {
      "id": "e6ad76f6-9038-4154-9f4c-d6b5c3b5e5aa",
      "created_at": "2023-03-24T16:22:05.337Z",
      "updated_at": "2023-03-24T17:00:05.337Z",
      "completed_at": "2023-03-24T18:00:05.337Z",
      "title": "Comprar pão",
      "description": "Ir a padaria e comprar pão."
    },
  ]
}
```
