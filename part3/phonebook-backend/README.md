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
