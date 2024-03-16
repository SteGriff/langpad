# Langpad and Lingomio

Langpad and Lingomio are your personal language-learning glossary editors.

**Langpad** is an offline, local-first, static web app, with no login, and no cloud save. Just your glossary.

**Lingomio** (WIP 🚧) is an online web app, with user login, and cloud save/sync of your library of glossaries (books).

Both apps are installable as mobile icons on your phone/tablet (PWAs).

![Langpad and Lingomio logos](/resources/compare.jpg)

## Lingomio 

Live site:

 + TBC

### Dev

Jumping back in:

 + 💿 No DB? Run first time DB setup scripts: `npm run migrations`
 + 🧨 Old data? Clear down everything with the same command!
 + 🚦 `npm run dev`
 + Register at <http://localhost:1954/register>
 + Visit app at root URL <http://localhost:1954/>

Docs:

 + <https://www.npmjs.com/package/better-sqlite3>
     - `.run` is fire and forget (returns row id)
     - `.get` gets 1 row as object
     - `.all` returns array of row objects
     - <https://github.com/WiseLibs/better-sqlite3/blob/HEAD/docs/api.md>
 + <https://github.com/Huachao/vscode-restclient>

## Tech

Based on `sg-login`:

- ES Modules
- Node 18
- Nunjucks
- Better-Sqlite3
- Express Sessions
- Try to do some best practices like salt and stuff
- zxcvbn for password strength

## sg-login Usage

The base system provides the following pages:

- Index (`/`)
- Login (`/login`)
- Register (`/register`)

There are two usage styles:

1.  POST-Redirect-GET (PRG)
2.  JSON API

### 1. PRG

POST to the `/login`, `/logout`, or `/register` routes with Form Data (see example Login page). On success, you will be redirected to index with the Session User set. On failure, you'll stay on the page and the model will be a common result type with a `status` and `message` or `model`.

### 2. JSON

POST with form data or JSON data to the `/api/login`, `/api/logout`, or `/api/register` endpoints with e.g. `{"username":"Ste","password":"Test"}`.

```js
await fetch("/api/login", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ username: "Ste", password: "Test" }),
});
```

Registration also accepts an optional `email` parameter (make this mandatory if you want).

You will receive a JSON response like:

```json
{
  "status": "OK",
  "model": {
    "ID": 1,
    "Username": "Ste",
    "Email": "ste@example.org"
  }
}
```

For failed registration, the response will have a `message` field, and the `model` field will be the complete result object from zxcvbn.

Successful registration logs you in immediately.

Get the current user with `GET /api/user` which will either return the user model or a 401 error.

## Data

### Users

Salt is 200 chars to accomodate 128 bytes to base64 (should be 172 chars)

### Books

Privacy is an int:

+ 0 Private
+ 1 Unlisted
+ 2 Public

The distinction between 1 and 2 depends on there being an "Explore" screen at some time.

### Sqlite3

Each column in an SQLite 3 database is assigned one of the following type affinities:

- TEXT
- NUMERIC
- INTEGER
- REAL
- BLOB

<https://www.sqlite.org/datatype3.html>

Download the SQLite CLI from: <https://sqlite.org/download.html>

Look for 'sqlite-tools-win32'

[SQLite CLI docs](https://sqlite.org/cli.html)

### Run SQL

To run SQL migrations one-by-one or to run the inspections, use SQLite CLI, and, for example:

```
sqlite> .read sql/check-logs.sql
```

### Operations (ops)

We have some `mjs` files in `/ops` which run things:

 + `npm run migrations` - runs `/ops/migrations.mjs` - sets up DB for first time;
 + `npm run status` - run `/ops/status.mjs` - gets stats about extant data.
 
