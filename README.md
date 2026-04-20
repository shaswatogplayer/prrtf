# Shaswat Gupta — AI Data Analyst Portfolio

A two-page, responsive portfolio site built with plain HTML, CSS, and JavaScript, with a Three.js hero scene and 3D card tilt effects. No build step, no framework — just a local server and a browser.

## Run locally
```
cd "C:\Users\HP\Desktop\portfolio"
python -m http.server 5500
```
Then open http://localhost:5500

> Note: the hero uses ES modules (Three.js via CDN), so it must be served over HTTP — opening `index.html` directly with `file://` will break the 3D scene.

## Pages
- `index.html` — Home: hero, about, experience, skills, certifications, work teaser, services, contact
- `work.html` — dedicated projects page with detailed case studies

## Edit content
- **Name / hero copy / rotator** — `index.html` hero section and `script.js` (`words` array)
- **Experience & Education** — `#experience` section in `index.html`
- **Skills** — `#skills` section cards
- **Certifications** — `#certifications` section (edit card titles and replace `href="#"` with credential URLs)
- **Projects** — `work.html`, each `<article class="project">`
- **Services** — `#services` section
- **Contact / social links** — LinkedIn, GitHub, Tableau Public, email — search the HTML for the URLs to swap
- **Resume** — drop your PDF at `assets/resume.pdf`
- **Project screenshots** — drop PNGs at `assets/projects/rag.png`, `pipeline.png`, `automation.png`, `dashboards.png` (they auto-replace the SVG placeholders)

## Deploy
- **GitHub Pages** — enable Pages on the repo, branch `main`, root — live at `https://<user>.github.io/<repo>/`
- **Netlify Drop** — drag the folder onto https://app.netlify.com/drop
- **Vercel** — `vercel` CLI or drag-drop import

## Customizing colors
Edit the `:root` CSS variables at the top of `styles.css`. Accent colors are `--accent` and `--accent-2`.

## Contact
Email: guptashaswat99@gmail.com
