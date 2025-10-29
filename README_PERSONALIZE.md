# Juwayriya — Personalized Pastel Theme

This folder contains a drop-in site to personalize your portfolio with a Monet-inspired lilac + peach aesthetic.

## How to use
1. Copy everything in this folder into your repo (`juwayriyawebsite/`), or replace the existing `index.html`, `about.html`, `contact.html`, and add `assets/css/juwa-theme.css` and `assets/js/main.js`.
2. Replace `assets/images/banner.png` with your greeting image (any aspect ratio works — it's set as a cover background and will always look centered and blended).
3. Put your artworks into `assets/images/` as `art1.png`, `art2.png`, … `art11.png` (or update the file names in `index.html`).
4. Deploy. If you use Netlify, just push to GitHub; Netlify will update automatically.

### Notes
- The hero uses `background-blend-mode` to *blend your banner image with the lilac/peach wash*, so it never looks like a stark rectangle.
- All gallery images are lazy-loaded; no gradients, no "dentist office" vibe.
- Typography is system-ui for speed and a clean, elegant look; swap to any font if you prefer.
