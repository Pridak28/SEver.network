# SEVER Network – Deployment & Update Guide

## Overview

This project consists of a backend (Node.js/Express, deployed on Render) and a frontend (static HTML/CSS/JS, deployed on Netlify).

---

## Backend (Render)

- **Location:** `Blockchain S/`
- **Entry Point:** `src/server.js`
- **Render Root Directory:** `Blockchain S`
- **Start Command:** `node src/server.js`
- **Build Command:** `npm install`
- **API URL:** `https://website-sever-netwrok.onrender.com/`

### To update backend:

1. Make code changes in `Blockchain S/`.
2. Commit and push to GitHub.
3. Trigger a redeploy on Render (or set up auto-deploy).

---

## Frontend (Netlify)

- **Location:** Project root (e.g. `index.html`, `login.html`, `wallet.html`, `css/`, `js/`)
- **API calls:** All API calls should use the Render backend URL above.

### To update frontend:

1. Make changes to HTML, CSS, or JS files in the project root.
2. Ensure all API URLs point to `https://website-sever-netwrok.onrender.com/` (not localhost).
3. Deploy to Netlify (drag & drop or connect GitHub repo).

---

## Updating API URLs

- In all frontend files (including `login.html`, `wallet.html`, and any JS), set:
  ```js
  const API_BASE = "https://website-sever-netwrok.onrender.com/";
  ```
- Replace any `http://localhost:3000/` with the API_BASE above.

---

## Troubleshooting

- If the frontend cannot connect to the backend, check CORS settings and API URLs.
- If you see 404 or CORS errors, make sure the backend is running and the URL is correct.

---

## Last updated: 22 April 2025
