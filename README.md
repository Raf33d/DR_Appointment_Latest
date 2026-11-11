<div align="center">

<img src="frontend/public/logo.svg" alt="MedBook logo" height="64" />

# MedBook

**Book a doctor in under a minute.**
A full-stack doctor appointment system with a patient website, a staff panel for admins and doctors, and a REST API.

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite%20%2F%20Turso-libSQL-4ff8d2?logo=sqlite&logoColor=white)
![Node](https://img.shields.io/badge/Node-%E2%89%A522-5fa04e?logo=nodedotjs&logoColor=white)

[Features](#-features) · [How it fits together](#-how-it-fits-together) · [Run locally](#-run-locally) · [Deploy for free](#-deploy-for-free) · [API](#-api-reference) · [Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Features

<table>
<tr>
<td width="33%" valign="top">

### 🧑 Patients
- Browse doctors by speciality
- Pick a day and a 30-minute slot for the next 7 days
- Register, log in and edit a profile with a photo
- See, cancel and pay for appointments
- Demo payment with bKash, Nagad or card

</td>
<td width="33%" valign="top">

### 🩺 Doctors
- Dashboard with earnings, patients and latest bookings
- Mark appointments completed or cancel them
- Update fees, address and availability

</td>
<td width="33%" valign="top">

### 🛡️ Admin
- Dashboard with totals for doctors, patients and appointments
- Add doctors and switch their availability
- View and cancel every appointment

</td>
</tr>
</table>

> [!NOTE]
> Payments are a **demo only**. No money moves and no card or wallet details are sent to the server. The app only records that an appointment was marked as paid, with a `DEMO-…` reference.

---

## 🧭 How it fits together

```mermaid
flowchart LR
    P["🧑 Patient website<br/><sub>frontend/ · React + Vite</sub>"]
    S["🛡️ Staff panel<br/><sub>admin/ · React + Vite</sub>"]
    A["⚙️ REST API<br/><sub>backend/ · Express</sub>"]
    D[("🗄️ Database<br/><sub>SQLite file locally<br/>Turso when deployed</sub>")]

    P -- "HTTPS + JSON" --> A
    S -- "HTTPS + JSON" --> A
    A --> D
```

| Folder | What it is | Local URL | Hosted on |
|---|---|---|---|
| [`frontend/`](frontend) | Patient website | http://localhost:50000 | Netlify |
| [`admin/`](admin) | Staff panel (admin and doctor logins) | http://localhost:10000 | Netlify |
| [`backend/`](backend) | REST API | http://localhost:4000 | Render |
| — | Database | `backend/data/medbook.db` | Turso |

The backend talks to the database through [`@libsql/client`](https://github.com/tursodatabase/libsql-client-ts). With no `TURSO_DATABASE_URL` set it uses a plain SQLite file. With one set it uses a hosted Turso database. The SQL is the same either way, and the tables are created automatically on startup.

Uploaded profile photos are stored in the database (`files` table) rather than on disk, so they survive restarts on free hosting.

---

## 🚀 Run locally

**You need:** [Node.js 22 or newer](https://nodejs.org).

**1. Install everything** (from the project folder):

```bash
npm run setup
```

**2. Create the settings files.** Copy each example file and edit the backend one:

```bash
cp backend/.env.example backend/.env
```

```bash
cp frontend/.env.example frontend/.env
```

```bash
cp admin/.env.example admin/.env
```

In `backend/.env`, set your own `ADMIN_PASSWORD` and a long random `JWT_SECRET`. This command prints one:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**3. (Optional) Add sample doctors** so the site isn't empty. Put `SEED_DOCTOR_PASSWORD=<at least 8 characters>` in `backend/.env`, then:

```bash
npm run seed --prefix backend
```

**4. Start all three apps:**

```bash
npm run dev
```

Then open the **patient website** at http://localhost:50000 and the **staff panel** at http://localhost:10000.

Log in to the staff panel as **Admin** with `ADMIN_EMAIL` / `ADMIN_PASSWORD`, or as **Doctor** with a doctor's email and password.

<details>
<summary><b>Useful scripts</b></summary>

| Command | What it does |
|---|---|
| `npm run setup` | Installs the root, backend, frontend and admin packages |
| `npm run dev` | Starts the API, patient website and staff panel together |
| `npm run build` | Builds both websites into their `dist/` folders |
| `npm run seed --prefix backend` | Adds 6 sample doctors (skips ones that already exist) |
| `npm run smoke --prefix backend` | End-to-end check against a running API: books, pays, completes and cancels, then cleans up after itself |

</details>

<details>
<summary><b>Look inside the local database</b></summary>

Open `backend/data/medbook.db` with the free [DB Browser for SQLite](https://sqlitebrowser.org/). The tables are `users`, `doctors`, `appointments` and `files`.

</details>

---

## 🌍 Deploy for free

The plan uses three free services. You'll need to create accounts and click through their dashboards yourself. Each step below says exactly what to fill in.

| Piece | Service | Why this one |
|---|---|---|
| 🗄️ Database | [Turso](https://turso.tech) | Hosted SQLite. Keeps your data permanently. |
| ⚙️ API | [Render](https://render.com) | Runs the Express server. Set up from [`render.yaml`](render.yaml). |
| 🖥️ Both websites | [Netlify](https://netlify.com) | Hosts static sites. Set up from each folder's `netlify.toml`. |

> [!IMPORTANT]
> **Push this project to GitHub first.** Render and Netlify both deploy straight from your GitHub repository, and redeploy automatically every time you push.

### Step 1 · Create the database on Turso

1. Sign up at [turso.tech](https://turso.tech) and open the dashboard.
2. Create a **database** (for example `medbook`). Pick the location closest to you.
3. Open the database and copy its **URL**. It starts with `libsql://`.
4. Create a **token** for the database (read & write) and copy it.

Keep both values for step 2. The tables are created automatically the first time the API starts.

<details>
<summary>Want to bring your local data along?</summary>

With the [Turso CLI](https://docs.turso.tech/cli/introduction) you can create the database from your local file instead:

```bash
turso db create medbook --from-file backend/data/medbook.db
```

This copies **everything** in the file, including test patients and their password hashes. Only do it if that's what you want.

</details>

### Step 2 · Put the API on Render

1. Sign up at [render.com](https://render.com) and connect your GitHub account.
2. Click **New → Blueprint** and choose this repository. Render reads [`render.yaml`](render.yaml) and sets up a free web service called `medbook-api`.
3. Render asks for these values:

   | Variable | Value |
   |---|---|
   | `ADMIN_EMAIL` | Email for the admin login |
   | `ADMIN_PASSWORD` | A strong password for the admin login |
   | `TURSO_DATABASE_URL` | The `libsql://…` URL from step 1 |
   | `TURSO_AUTH_TOKEN` | The token from step 1 |
   | `CORS_ORIGINS` | Leave empty for now (filled in at step 4) |

   `JWT_SECRET` is generated for you.
4. Click **Apply** and wait for the deploy to finish.
5. Copy your API URL, e.g. `https://medbook-api.onrender.com`. Opening `…/health` should show `{"ok":true}`.

### Step 3 · Put both websites on Netlify

Do this **twice**: once for `frontend` and once for `admin`.

1. Sign up at [netlify.com](https://netlify.com) and click **Add new site → Import an existing project → GitHub**, then pick this repository.
2. Set **Base directory** to `frontend` the first time, and `admin` the second time. The build command (`npm run build`) and publish folder (`dist`) are read from that folder's `netlify.toml`.
3. Under **Environment variables**, add:

   | Variable | Value |
   |---|---|
   | `VITE_BACKEND_URL` | Your Render API URL from step 2 (no trailing `/` needed) |

4. Click **Deploy**. Rename the sites under **Site configuration → Change site name** if you like, e.g. `medbook-patients.netlify.app` and `medbook-staff.netlify.app`.

> [!WARNING]
> `VITE_BACKEND_URL` is baked in when the site is built. If you change it later, trigger a new deploy in Netlify (**Deploys → Trigger deploy**).

### Step 4 · Lock the API to your two sites (recommended)

Back on Render, open `medbook-api` → **Environment** and set:

```
CORS_ORIGINS=https://medbook-patients.netlify.app,https://medbook-staff.netlify.app
```

Use your real Netlify URLs, separated by a comma. Save, and Render restarts the API.

### Step 5 · Add sample doctors (optional)

Run the seed **from your computer**, pointed at Turso. Use the values from step 1 and a password the sample doctors will log in with.

**macOS / Linux / Git Bash**

```bash
TURSO_DATABASE_URL="libsql://…" TURSO_AUTH_TOKEN="…" SEED_DOCTOR_PASSWORD="…" npm run seed --prefix backend
```

**Windows PowerShell**

```powershell
$env:TURSO_DATABASE_URL="libsql://…"; $env:TURSO_AUTH_TOKEN="…"; $env:SEED_DOCTOR_PASSWORD="…"; npm run seed --prefix backend
```

Or skip this step and add doctors from the staff panel instead (**Admin → Add Doctor**).

### 🎉 Done

Share the patient website link with anyone. Staff use the staff panel link.

> [!NOTE]
> **The first visit can be slow.** Render's free plan puts the API to sleep after about 15 minutes without visitors. The next request wakes it up in roughly 30–60 seconds, and after that it's fast again. Free-plan limits change from time to time, so check each service's pricing page.

---

## ⚙️ Configuration

### Backend (`backend/.env` locally, Render → Environment when deployed)

| Variable | Required | Description |
|---|:---:|---|
| `JWT_SECRET` | ✅ | Long random string that signs login tokens |
| `ADMIN_EMAIL` | ✅ | Admin login email |
| `ADMIN_PASSWORD` | ✅ | Admin login password |
| `PORT` | | Port to listen on. Render sets it automatically. Default `4000` |
| `TURSO_DATABASE_URL` | | `libsql://…` URL. If empty, a local SQLite file is used |
| `TURSO_AUTH_TOKEN` | | Token for the Turso database |
| `DATABASE_FILE` | | Local SQLite file path. Default `data/medbook.db` |
| `CORS_ORIGINS` | | Comma-separated sites allowed to call the API. Empty allows all |
| `SEED_DOCTOR_PASSWORD` | | Only used by `npm run seed` |

The API refuses to start if any of the ✅ variables are missing.

### Websites (`frontend/.env`, `admin/.env` locally, Netlify → Environment variables when deployed)

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | URL of the API, e.g. `http://localhost:4000` or `https://medbook-api.onrender.com` |

---

## 📡 API reference

Logged-in requests send a token in a header: `atoken` (admin), `dtoken` (doctor) or `token` (patient). Every response is JSON with a `success` field.

<details>
<summary><b>Patients</b> · <code>/api/user</code></summary>

| Method | Path | Auth | Description |
|---|---|:---:|---|
| `POST` | `/register` | | Create an account → `token` |
| `POST` | `/login` | | Log in → `token` |
| `GET` | `/get-profile` | 🔑 | Current patient's profile |
| `POST` | `/update-profile` | 🔑 | Update profile (multipart; optional `image` up to 2 MB) |
| `POST` | `/book-appointment` | 🔑 | `{ docId, slotDate, slotTime }` |
| `GET` | `/appointments` | 🔑 | The patient's appointments |
| `POST` | `/cancel-appointment` | 🔑 | `{ appointmentId }` |
| `POST` | `/payment-demo` | 🔑 | `{ appointmentId, paymentMethod: "bkash" \| "nagad" \| "card" }` |

</details>

<details>
<summary><b>Doctors</b> · <code>/api/doctor</code></summary>

| Method | Path | Auth | Description |
|---|---|:---:|---|
| `GET` | `/list` | | Public list of doctors |
| `POST` | `/login` | | Log in → `token` |
| `GET` | `/appointments` | 🔑 | The doctor's appointments |
| `POST` | `/complete-appointment` | 🔑 | `{ appointmentId }` |
| `POST` | `/cancel-appointment` | 🔑 | `{ appointmentId }` |
| `GET` | `/dashboard` | 🔑 | Earnings, patient count, latest bookings |
| `GET` | `/profile` | 🔑 | The doctor's profile |
| `POST` | `/update-profile` | 🔑 | `{ fees, address, available }` |

</details>

<details>
<summary><b>Admin</b> · <code>/api/admin</code></summary>

| Method | Path | Auth | Description |
|---|---|:---:|---|
| `POST` | `/login` | | Log in → `token` |
| `POST` | `/add-doctor` | 🔑 | Create a doctor (`address` is a JSON string) |
| `POST` | `/all-doctors` | 🔑 | Every doctor |
| `POST` | `/change-availability` | 🔑 | `{ docId }`: toggle availability |
| `GET` | `/appointments` | 🔑 | Every appointment |
| `POST` | `/cancel-appointment` | 🔑 | `{ appointmentId }` |
| `GET` | `/dashboard` | 🔑 | Totals and latest bookings |

</details>

<details>
<summary><b>Other</b></summary>

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | `{"ok":true}` when the API and database are up |
| `GET` | `/uploads/:id` | A stored profile photo |

</details>

---

## 🗂️ Project structure

```text
.
├── render.yaml              # Render Blueprint for the API
├── package.json             # setup / dev / build scripts for everything
├── backend/
│   ├── server.js            # Express app, CORS, uploads, health check
│   ├── config/sqlite.js     # libSQL client (local file or Turso) + schema
│   ├── controllers/         # admin, doctor and patient logic
│   ├── middlewares/         # JWT checks for each role, image upload
│   ├── models/              # small model layer over SQL, file storage
│   ├── routes/              # /api/admin, /api/doctor, /api/user
│   └── scripts/             # seed.js, smokeTest.js
├── frontend/                # patient website  (netlify.toml inside)
│   └── src/{pages,components,context,assets}
└── admin/                   # staff panel      (netlify.toml inside)
    └── src/{pages/Admin,pages/Doctor,components,context,assets}
```

---

## 🛠️ Troubleshooting

<details>
<summary><b>The website loads but shows "Something went wrong while fetching doctors data"</b></summary>

- The API may be waking up on Render. Wait up to a minute and refresh.
- Check that `VITE_BACKEND_URL` in Netlify is your Render URL, then redeploy the site.
- If you set `CORS_ORIGINS`, make sure it lists the exact Netlify URLs, starting with `https://`.

</details>

<details>
<summary><b>Refreshing a page on Netlify shows "Page not found"</b></summary>

The site's **Base directory** must be `frontend` or `admin`, so Netlify picks up that folder's `netlify.toml`, which sends every path to `index.html`.

</details>

<details>
<summary><b>The Render deploy fails or the API exits right away</b></summary>

Open **Logs** on Render:
- `Missing required environment variables` means a required value is empty. Fill it in under **Environment**.
- `Unable to start the database` means `TURSO_DATABASE_URL` or `TURSO_AUTH_TOKEN` is wrong or expired. Create a new token in Turso.

</details>

<details>
<summary><b>Everyone got logged out</b></summary>

Login tokens are signed with `JWT_SECRET`. Changing it signs everyone out. Just log in again.

</details>

---

<div align="center">
<sub>MedBook is a demo project. Don't use it for real patient records without adding proper security, backups and privacy compliance.</sub>
</div>
