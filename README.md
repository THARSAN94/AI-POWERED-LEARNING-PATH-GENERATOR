<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Lonexora Skills — AI-Powered Learning Path Generator

Lonexora Skills generates day-by-day AI learning roadmaps, daily assessments and 
verifiable completion certificates. Includes everything you need to run and deploy the app.

View your app in AI Studio: https://ai.studio/apps/509dd427-3638-4423-b942-8fb62e95c2c9

## Run Locally

**Prerequisites:**  Node.js `^20.19.0 || >=22.12.0` (Vite 8 requires this range — see `.nvmrc`)


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy on Render

This repository ships with a `render.yaml` blueprint, so Render can provision the
service automatically.

1. Push this repository to GitHub and in Render choose **New > Blueprint** and pick it.
   Render reads `render.yaml` (build command `npm install && npm run build`,
   start command `npm start`, health check `/api/health`).
2. Fill in the two `sync: false` variables that Render prompts for during provisioning:
   - `GEMINI_API_KEY` — your Gemini API key. Required for live AI curriculum and quiz
     generation; without it the server still starts and serves the built-in
     deterministic curriculum fallback engine.
   - `APP_URL` — the public URL of the service (e.g. `https://lonexora-skills.onrender.com`).
     Used to build certificate verification links and QR codes.
3. `NODE_VERSION` is pinned to 22 in `render.yaml`. Do not remove it: the default
   Node image on Render can be older than Vite 8 supports, which fails the build.

`NODE_ENV=production` makes `server.ts` serve the static `dist/` output of
`vite build` and disables the inline Vite dev middleware.

**Note on data persistence:** this project stores users, learning paths, assessment
results and certificates in the JSON file `data/lonexora_db.json`. Render's free
instance filesystem is ephemeral, so that file is reset on every redeploy or
cold-start-driven restart. Attach a Render Disk (or swap in a managed database) if
you need data to survive deploys.
