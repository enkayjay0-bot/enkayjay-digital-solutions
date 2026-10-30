# Enkayjay Digital Solutions — Website Package

**Positioning:** Websites. Systems. Digital Products.

A lightweight, responsive, single-page website built with HTML, CSS and vanilla JavaScript. No framework, build step, paid service, database, tracker or external front-end request is required.

## Package contents

- `website/` — the only folder needed for the public website.
- `docs/PLACEHOLDERS.md` — every remaining item requiring confirmation.
- `docs/TESTING.md` — completed checks and remaining real-world checks.
- `docs/ORIGINAL-FILES-REVIEW.md` — how the supplied HTML, CSS and JavaScript were preserved or improved.
- `docs/RENDER-DEPLOYMENT.md` — owner-managed Render Static Site settings and live checks.
- `docs/CLIENT-ACQUISITION.md` — offer, outreach scripts, onboarding and first-client action plan.
- `docs/lead-tracker.csv` — blank prospect-tracking template.
- `tests/browser-tests.js` — optional development tests; do not upload to the public server.

## 1. Complete the required settings before launch

### WhatsApp and email — confirmed and applied

The confirmed business contact settings are already in `website/js/config.js`:

```js
window.ENKAYJAY_CONFIG = Object.freeze({
  whatsappNumber: "233256800142",
  whatsappDisplay: "+233256800142",
  email: "Enkayjay.skills2@gmail.com"
});
```

- `whatsappNumber` uses international digits without `+`, spaces or punctuation.
- The direct contact buttons and prepared-enquiry actions now activate automatically.
- Blank, invalid or recognised placeholder values keep their related contact buttons disabled.
- Real delivery still needs an owner-managed test from the live website.

### Final domain

In `website/index.html`, replace every occurrence of:

```text
https://your-domain.example
```

with the final absolute website URL, preserving the existing paths:

- Canonical URL
- `og:url`
- `og:image` — keep `/assets/social-preview.png`
- `twitter:image` — keep `/assets/social-preview.png`

Example structure only: if the domain is `https://your-real-domain.com`, the social image URL becomes `https://your-real-domain.com/assets/social-preview.png`.

### PhotoHub

The current copy states only that PhotoHub is an Enkayjay project and is not publicly accessible. No live link or results are claimed. Add a fuller case study only when its details and visuals are approved.

## 2. Preview locally

You can open `website/index.html` directly in a modern browser. For a local HTTP preview, run this optional command from the project folder:

```bash
python3 -m http.server 8000 --directory website
```

Then open `http://localhost:8000` on the same computer. Stop the preview with `Ctrl+C`. No installation or build command is needed for the website itself.

## 3. Deploy on Render — owner-managed

Render is the confirmed hosting choice. This project needs only a **Static Site**; there is no backend, build step, start command, database or paid form service.

Follow [the Render deployment guide](docs/RENDER-DEPLOYMENT.md). The essential settings are:

| Setting | Value |
|---|---|
| Service type | Static Site |
| Build Command | Leave blank — no build required |
| Publish Directory | `website` when the full package is the repository root |
| Start Command | Not applicable |

Render’s documented static-site workflow uses a linked Git repository; **Manual Deploy** is not the same as uploading a ZIP. No GitHub repository or Render service has been connected or changed by this project. The guide explains how to handle that constraint yourself and how to apply the final `.onrender.com` or custom-domain URL to the SEO metadata.

After your deployment, test the mobile menu, internal links, Copy enquiry and both configured contact channels. Send one real WhatsApp and email enquiry yourself, then check the final social-sharing preview.

## How the enquiry form works

- It validates the visitor’s entries in the browser.
- It prepares a readable message with the project details.
- The visitor chooses WhatsApp, email or Copy enquiry.
- WhatsApp/email opens the relevant app with a prefilled message; the visitor must review and send it.
- No enquiry is automatically submitted, stored, emailed or received by a backend.
- Editing the form after preparation clears the old prepared message so an outdated enquiry is not sent accidentally.

## Editing and maintenance

- Main page content: `website/index.html`
- Colours, spacing and breakpoints: variables and rules at the top of `website/css/style.css`
- Contact settings: `website/js/config.js`
- Menu, validation and contact behaviour: `website/js/main.js`
- Social-sharing artwork: `website/assets/social-preview.png` (1200 × 630 PNG)

Keep the existing section IDs (`home`, `services`, `portfolio`, `process`, `contact`) unless you also update every related navigation link and script reference.

## Final launch checklist

- [x] Confirmed WhatsApp number and business email added
- [ ] Real WhatsApp and email delivery tested by the owner
- [ ] Final domain URLs replaced
- [ ] PhotoHub wording approved
- [ ] Website uploaded with folder structure intact
- [ ] Mobile menu and internal links tested on the live domain
- [ ] One real enquiry sent through each configured channel
- [ ] Social share preview checked on the live domain
- [ ] Outreach offer and payment terms approved before sending quotes
