# CrimeScope AI 2.0 – Project Overview

## Description
A web‑based AI‑powered crime intelligence dashboard for Karnataka, visualising crime trends, heat‑maps and providing AI‑driven predictions and insights.

## What Was Updated
- **Day (light) theme** – default `data‑theme="light"` with pastel colour overrides in `style.css`.
- **Team / App logo** – all logo images now reference the supplied URL:
  `https://storage.googleapis.com/vision-hack2skill-production/innovator/USER00666542/1780112526828-1779253126220GeminiGeneratedImageq5xor9q5xor9q5xo1.webp`
- **Karnataka heat‑map** – replaced the canvas‑drawn map with a static image `karnataka_map.png`. The broken `<img>` tag has been fixed (`<img id="karnatakaMap" src="karnataka_map.png" …>`).
- **Disabled dynamic map drawing** – calls to `drawKarnatakaMap()` are now commented out, preventing JavaScript errors.

## Assets
- `karnataka_map.png` – static map generated via the AI image tool.
- Logo URL (used throughout the app).

## Running the App
1. Open `index.html` in a modern browser (Chrome/Edge recommended).
2. The page loads with the light theme by default. Use the sun/moon toggle in the top‑right corner to switch to dark mode.
3. All interactive sections (features, heatmap, AI predictions, etc.) are available via the navigation links or the **Launch Platform** button.

## Development Notes
- The project is a single‑page static site – no build step required.
- If you wish to revert to the canvas‑based map, re‑enable the `drawKarnatakaMap()` function in `app.js` and replace the `<img>` tag with the original `<canvas id="karnatakaMap">` element.

---
*Generated on 2026‑06‑03 by Antigravity*
