# ⚙️ Chapter 15: Installation, Deployment & Zero-Build Setup

## 📌 1. Zero-Build Architecture

**CrimeScope AI 2.0** is engineered as a **100% Zero-Build Web Application**. It requires no Node.js compilation, Webpack bundling, Docker containers, or server provisioning. It runs natively in any standard web browser right out of the box.

---

## ⚡ 2. Instant Evaluator Access (Zero Setup)

1. Open the [Live Web Application](https://ranjeet7680.github.io/Al-Driven-Crime-Analytics-Visualization-Platform/).
2. Click **⚡ Instant Demo Access** on the landing page or login dialog.
3. You are immediately redirected to the unlocked tactical Command Center HUD with all 14 modules active.

---

## 💻 3. Local Development Setup (Options)

### Option A: Direct Browser Launch
Simply double-click `index.html` in your file explorer to run the application directly from your local disk.

### Option B: Python Local Server
```bash
# Clone the repository
git clone https://github.com/Ranjeet7680/Al-Driven-Crime-Analytics-Visualization-Platform.git

# Enter project directory
cd Al-Driven-Crime-Analytics-Visualization-Platform

# Launch local server with Python
python -m http.server 8080

# Open in browser: http://localhost:8080
```

### Option C: Node.js `npx http-server`
```bash
# Launch with npx
npx http-server ./ -p 8080

# Open in browser: http://localhost:8080
```

---

## 🚀 4. GitHub Pages Continuous Deployment (CI/CD)

The repository includes an automated GitHub Action workflow located at [`.github/workflows/deploy-pages.yml`](https://github.com/Ranjeet7680/Al-Driven-Crime-Analytics-Visualization-Platform/blob/main/.github/workflows/deploy-pages.yml):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
