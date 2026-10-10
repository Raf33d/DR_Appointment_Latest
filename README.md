# MedBook Appointment System

MedBook is a local doctor appointment demo with separate patient and staff panels. It uses MySQL for its database and does not require a paid service or real payment processing.

## Requirements

- Node.js 20 or newer
- MySQL Server 8.0 installed locally (the default setup uses its `mysqld.exe` at `C:/Program Files/MySQL/MySQL Server 8.0`)

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and change the admin password and JWT secret.
2. In the project folder, run `npm install` and then `npm run dev`.
3. Open the patient app at [http://localhost:50000](http://localhost:50000) or the staff panel at [http://localhost:10000](http://localhost:10000).

The backend starts a project-local MySQL database on `127.0.0.1:3307`, separate from any MySQL service already using port 3306. Its data stays in `backend/.mysql-active-data` and is intentionally excluded from Git.

## View the database

Open MySQL Workbench and create a connection with:

- Hostname: `127.0.0.1`
- Port: `3307`
- Username: `root`
- Password: leave blank

Connect and refresh the Schemas panel to see the `medbook` database and its `users`, `doctors`, and `appointments` tables. This local demo database only accepts connections from this computer.

## Import old MongoDB data (optional, one time)

The legacy MongoDB data is not needed to run MedBook. To import it, first make the old MongoDB server available locally on port `27018`, then run `npm run import:mongodb`. The optional import script preserves the MongoDB source and can be pointed at another source with `MONGO_IMPORT_URI` in `backend/.env`.

## Build

Run `npm run build` to create production builds of both web panels.
