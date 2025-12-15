# Local SQLite DB + Node API (for this repo)

This repo currently contains a Create-React-App frontend (`error-tracker/`).
This adds a simple local Node/Express API (`server/`) backed by a local SQLite database file.

## What you get
- SQLite DB file: `server/error_tracker.db`
- API: `http://localhost:5000`
- Endpoints:
  - `GET /api/health`
  - `GET /api/errors` (supports `q`, `status`, `severity`, `environment`, `project`)
  - `GET /api/errors/:id`
  - `POST /api/errors`
  - `PATCH /api/errors/:id`
  - `DELETE /api/errors/:id`

## Run the backend
```bash
cd server
npm install
npm run dev
```

## Run the frontend
```bash
cd error-tracker
npm install
npm start
```

## Frontend notes
The frontend `error-tracker/package.json` includes:
- `"proxy": "http://localhost:5000"`

So you can call the API like:
```js
axios.get('/api/errors')
```

