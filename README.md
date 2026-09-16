# NovaNectar ERP

NovaNectar ERP is a full-stack internal operations platform for managing employees, projects, sales, training, internships, customer enquiries, tickets, messages, and digital-marketing work.

The repository is an npm workspace:

| App | Technology | Local address |
| --- | --- | --- |
| `frontend` | Next.js | `http://localhost:3001` |
| `backend` | Express + MongoDB | `http://localhost:4001` |
| `DBMS` | Shared Mongoose models | — |

## Quick start

### 1. Pull the project and install dependencies

Use Node.js 20 or newer and npm 10 or newer. After cloning, or after receiving changes with `git pull`, run this at the repository root:

```bash
npm install
```

This installs the root, frontend, backend, and shared-model workspace dependencies.

### 2. Create a MongoDB Atlas database

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a project and a free/shared cluster.
2. In **Database Access**, create a database user with read/write access. Keep its username and password.
3. In **Network Access**, add your current IP address. For a short local test only, `0.0.0.0/0` allows all IPs; restrict this before any real deployment.
4. Select **Connect** → **Drivers** and copy the Node.js connection string.
5. Replace `<username>`, `<password>`, and `<cluster-url>` in that URI. If the password contains special characters, URL-encode it.

### 3. Configure environment variables

Create your untracked local files from the templates:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

On Windows PowerShell, use:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

Open `backend/.env` and set:

```dotenv
PORT=4001
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/erp?retryWrites=true&w=majority
JWT_SECRET=use-a-long-unique-random-secret-at-least-16-characters
WEB_ORIGIN=http://localhost:3001
RESEND_API_KEY=
```

Do not paste secrets into `.env.example` or commit the real `.env` file. The frontend default already points to `http://localhost:4001`; change `frontend/.env.local` only if the backend uses another address.

### 4. Add the Resend API key (optional, recommended for email)

The app works without Resend, but outgoing email is logged/mock-sent locally. To send real email:

1. Create an API key in [Resend](https://resend.com/api-keys).
2. Add it to `backend/.env`:

   ```dotenv
   RESEND_API_KEY=re_your_key_here
   ```

3. Verify a sending domain in Resend and update the hard-coded sender `NovaNectar ERP <onboarding@resend.dev>` in the backend email routes to an address on that domain before production.

No other third-party API key is currently required by the application.

### 5. Create your first super-admin

Run this once from the repository root, replacing the sample values with your own. The command creates or updates only this administrator and its employee profile; it does not clear existing data.

```bash
npm --prefix backend run create-superadmin -- --name "Your Name" --login your-login-id --password "a-strong-password"
```

The default organisation slug is `novanectar`, which is what the current Admin Login screen expects. Keep that default for local use. The `--login` value is your login ID, not necessarily an email address.

### 6. Start the application

From the repository root:

```bash
npm run dev
```

Wait for both services to start, then open [http://localhost:3001](http://localhost:3001). You can confirm the API and database connection at [http://localhost:4001/health](http://localhost:4001/health); it should return `"mongo": { "connected": true }`.

## First login and daily use

1. Open `/login` and choose **Admin Login**.
2. Enter the login ID and password used for `create-superadmin`.
3. The admin dashboard opens after successful sign-in.
4. Use the dashboard controls to add employees, assign departments and roles, create additional administrators, manage projects/tasks, work with sales contacts, training and internship records, customer enquiries, tickets, notifications, and internal messages.
5. Employees sign in from the **Employee Login** tab with the credentials assigned to them. Department-aware views route sales users to the sales workspace and digital-marketing users to their dashboard.

The `/register` page submits an account request for an existing administrator to review; it does not create the initial administrator. Use the bootstrap command above for the first account.

## Useful commands

Run these from the repository root:

```bash
npm run dev        # Run backend and frontend together
npm run build      # Create production builds
npm run lint       # Lint both applications
```

To run one service independently:

```bash
npm --prefix backend run dev
npm --prefix frontend run dev
```

## Troubleshooting

| Problem | Check |
| --- | --- |
| API returns `db_unavailable` or health says `connected: false` | Verify `MONGODB_URI`, Atlas database-user permissions, and Network Access/IP allow-list. |
| Browser request is blocked by CORS | Confirm `WEB_ORIGIN=http://localhost:3001` and restart the backend. |
| Login fails after a new setup | Run the super-admin command again with the intended login/password, then use **Admin Login**. |
| Email is only logged instead of delivered | Add `RESEND_API_KEY`; for production, verify a Resend domain and change the sender address in the email routes. |
| Port is already in use | Stop the other process or change `PORT` and set `NEXT_PUBLIC_API_BASE_URL` to the matching backend URL. |

## Security notes

Use a strong, unique `JWT_SECRET` and database password. Keep `.env`, `.env.local`, API keys, Atlas URIs, and real customer/employee data out of Git. Limit Atlas network access and database privileges when deploying beyond local development.
