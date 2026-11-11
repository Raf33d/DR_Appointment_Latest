# MedBook

A doctor appointment app. Patients find a doctor and book a time. Doctors and admins manage appointments from a staff panel.

Built with React, Tailwind, Express and SQLite.

## Try the demo

The demo runs fully in the browser with sample data, so no server or database is needed. Each visitor's changes are saved only on their own device.

| Login | Email | Password |
|---|---|---|
| Patient | `patient@medbook.demo` | `demo1234` |
| Admin | `admin@medbook.demo` | `demo1234` |
| Doctor | `nadia.rahman@medbook.demo` | `demo1234` |

- Patient website: `https://<your-site>.netlify.app`
- Staff panel: `https://<your-site>.netlify.app/admin`

## Put the demo on Netlify (free)

**From GitHub:** on [netlify.com](https://netlify.com), choose **Add new site → Import an existing project**, pick this repository and click **Deploy**. Don't change any settings.

**Or drag and drop:** run `npm run setup`, then `npm run build:demo`, then drag the `demo-dist` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).

## Run it on your computer

You need [Node.js 22+](https://nodejs.org).

1. Install everything:
   ```bash
   npm run setup
   ```
2. Copy `backend/.env.example` to `backend/.env`, then set your own `ADMIN_PASSWORD` and `JWT_SECRET`.
3. Start it:
   ```bash
   npm run dev
   ```
4. Open the patient website at http://localhost:50000 and the staff panel at http://localhost:10000.

## Folders

- `frontend/`: patient website
- `admin/`: staff panel
- `backend/`: API and database
- `demo/`: fake in-browser API used by the demo

## Deploying the real app

To run it with a real shared database, the repository also includes a [`render.yaml`](render.yaml) for [Render](https://render.com). Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` (from a free [Turso](https://turso.tech) database) when Render asks for them.
