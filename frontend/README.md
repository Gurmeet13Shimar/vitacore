# VitaCore — Local Setup Guide

## Requirements

- **Node.js** v18 or higher → https://nodejs.org/
- **npm** v9 or higher (comes with Node.js)

Check your versions:
```bash
node -v
npm -v
```

---

## Run Locally

**Step 1 — Install dependencies**
```bash
npm install
```

**Step 2 — Start the dev server**
```bash
npm run dev
```

**Step 3 — Open in browser**
```
http://localhost:5173
```

**Login:** use any email and password — it's all mock data.

---

## Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. You can serve it with:
```bash
npm run preview
```

---

## Project Structure

```
vitacore-npm/
├── public/          Static assets (favicon, etc.)
├── src/
│   ├── components/  Reusable UI components + shadcn primitives
│   ├── context/     AuthContext (mock auth)
│   ├── data/        mockData.ts — all dummy data
│   ├── hooks/       useAuth.ts
│   ├── lib/         Utility helpers
│   └── pages/       All 10 pages (Login, Dashboard, Health, etc.)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Notes

- No backend required — all data is mocked in `src/data/mockData.ts`
- No environment variables needed
- No `.mjs` files used
