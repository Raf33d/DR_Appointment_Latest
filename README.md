# MedBook Appointment System

MedBook is a local doctor appointment demo with separate patient and staff panels. It uses SQLite, a regular SQL database stored in one local file, and does not require a paid service or real payment processing.

## Requirements

- Node.js 22 or newer

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and change the admin password and JWT secret.
2. In the project folder, run `npm run setup` once, then `npm run dev` whenever you want to use MedBook.
3. Open the patient app at [http://localhost:50000](http://localhost:50000) or the staff panel at [http://localhost:10000](http://localhost:10000).

The backend creates `backend/data/medbook.db` automatically. No database server or cloud account is required. The database file is intentionally excluded from Git so patient records and passwords are not published.

## View the database

Open `backend/data/medbook.db` with the free [DB Browser for SQLite](https://sqlitebrowser.org/) app to view and edit the `users`, `doctors`, and `appointments` tables.

## Build

Run `npm run build` to create production builds of both web panels.
