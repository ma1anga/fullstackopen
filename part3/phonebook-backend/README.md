# Phonebook Backend

Simple backend API for the Full Stack Open phonebook project.

## Deployed Application

[https://phonebook-backend-bold-water-2846.fly.dev](https://phonebook-backend-bold-water-2846.fly.dev)

## Run Locally

Install dependencies and start the server in development mode:

```bash
npm install
npm run dev
```

## Environment Variables

This project reads environment variables from `.env` (via `dotenv`) when running locally.

### Local Development

Create a `.env` file in the project root with:

```env
MONGODB_URI=<your-mongodb-connection-string>
PORT=3001
```

Variables:

- `MONGODB_URI` (required): MongoDB connection string used by Mongoose in `model/person.js`.
- `PORT` (optional): HTTP port for the backend. Defaults to `3001` if omitted.

Do not commit real credentials. Keep `.env` local only.

### Fly Deployment

On Fly, set secrets instead of using a local `.env`:

```bash
fly secrets set MONGODB_URI="<your-mongodb-connection-string>"
```

`PORT` should not be set manually on Fly in this app. Fly provides it automatically and routes traffic to the app's internal port (`3001` in `fly.toml`).

## Sending Requests

Example API requests are available in the [`requests`](requests) folder (`requests/requests.rest`).

If you are using VS Code, install a REST client extension (for example, **REST Client**) to run `.rest` requests directly from the editor.

## Static Resources

Static frontend assets are built from the sibling project at `../phonebook` and served by this backend.

From the frontend project, build and copy the output:

```bash
cd ../phonebook
npm install
npm run build
cp -r dist ../phonebook-backend/
```
