# House Utility App

UTIL is a comprehensive household utility management platform designed to bring transparency, accountability, and efficiency to shared living expenses. Born from a real-world frustration experienced by university students managing shared apartment costs.

## Project Structure

```
UTIL_WEBAPP/
├── house-utility-frontend/       # Main application root
│   ├── src/                      # React frontend source
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Page components (Dashboard, Bills, etc.)
│   │   ├── context/              # React Context (AuthContext)
│   │   ├── services/             # API service layer (api.js)
│   │   ├── App.jsx               # Main app router
│   │   └── main.jsx              # Entry point
│   ├── Backend/                  # Express.js backend
│   │   ├── server.js             # Server entrypoint
│   │   ├── config/               # Configuration (passport, db)
│   │   ├── routes/               # API routes (auth, bills, expenses, etc.)
│   │   ├── controllers/          # Route handlers
│   │   ├── models/               # MongoDB schemas
│   │   ├── middleware/           # Auth middleware
│   │   ├── .env                  # Environment variables (keep secret)
│   │   └── .env.example          # Template for .env
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend & root dependencies
│   ├── vite.config.js            # Vite build config
│   └── tailwind.config.js        # Tailwind CSS config
└── .gitignore                    # Git ignore rules
```

## Prerequisites

- **Node.js** v18+ with npm or yarn
- **MongoDB** (local or cloud URI for `.env`)
- **Google OAuth2 credentials** (for email verification)

## Setup

### 1. Clone & Install Dependencies

```bash
cd house-utility-frontend
npm install
cd Backend
npm install
cd ..
```

### 2. Configure Environment Variables

In `house-utility-frontend/Backend/.env`, add your secrets (copy from `.env.example` and fill in values):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
FRONTEND_URLS=http://localhost:3000,http://localhost:3001
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**Never commit `.env` to Git** — it contains secrets.

### 3. Start the Backend

```bash
cd house-utility-frontend/Backend
node server.js
```

Expected output:
```
🔍 Environment Variables Check: MONGO_URI: ✅ Loaded JWT_SECRET: ✅ Loaded GOOGLE_CLIENT_ID: ✅ Loaded
🚀 Server running on port 5000
✅ MongoDB Connected
```

### 4. Start the Frontend (in a separate terminal)

```bash
cd house-utility-frontend
npm run dev
```

Vite will serve the frontend at `http://localhost:3000` (or `http://localhost:3001` if 3000 is busy).

## Key Features

- **Email Verification**: Google OAuth verification flow (`/verify-email`, `/verify-success`)
- **Authentication**: JWT-based auth with session support
- **Protected Routes**: Dashboard, expenses, bills, contributions only for logged-in users
- **Responsive Design**: Tailwind CSS styling
- **MongoDB**: Persistent data storage

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login with email/password
- `GET /api/auth/google/verify` — Start Google OAuth verification
- `GET /api/auth/google/callback` — Google OAuth callback
- `POST /api/auth/logout` — Logout user

### Other
- `GET /api/bills` — Fetch bills
- `POST /api/bills` — Create bill
- `GET /api/expenses` — Fetch expenses
- `POST /api/expenses` — Create expense

See `Backend/routes/` for full API documentation.

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser, ensure `FRONTEND_URLS` in `.env` includes your current dev port:
```env
FRONTEND_URLS=http://localhost:3000,http://localhost:3001
```
Then restart the backend.

### Port Already in Use
Kill the process using the port:
```powershell
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

### MongoDB Connection Error
Verify your `MONGO_URI` is correct and the database is accessible.

## Deployment

For production, see `house-utility-frontend/render.yaml` and `vercel.json` for Render.com and Vercel deployment configs.

### Production Checklist
- [ ] Use environment secrets manager (Vercel, Render, AWS Secrets Manager)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS and set `cookie.secure=true`
- [ ] Use `helmet` middleware for security headers
- [ ] Restrict `FRONTEND_URLS` to production domain(s) only
- [ ] Add rate limiting to auth endpoints

## Contributing

1. Create a feature branch
2. Make changes
3. Test locally (backend + frontend)
4. Commit and push
5. Open a pull request

<img width="1888" height="787" alt="image" src="https://github.com/user-attachments/assets/5ea1b707-e2c5-4243-9b29-55f5b6d96fe5" />


## License

MIT
