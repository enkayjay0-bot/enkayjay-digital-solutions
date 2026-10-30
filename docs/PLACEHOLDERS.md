# Remaining Placeholders and Confirmations

## Confirmed and applied

| Item | Applied value | Result |
|---|---|---|
| Business WhatsApp | `233256800142` in `website/js/config.js`; displayed as `+233256800142` | Direct and prepared-enquiry WhatsApp links activate. Real delivery still requires an owner-managed live test. |
| Monitored business email | `Enkayjay.skills2@gmail.com` in `website/js/config.js` | Direct and prepared-enquiry email links activate. Real delivery still requires an owner-managed live test. |
| Hosting preference | Render | Owner-managed Static Site instructions are included in `RENDER-DEPLOYMENT.md`. Nothing has been deployed or connected. |

The contact setup notice should disappear when JavaScript loads with these confirmed settings. If it remains visible, check that `js/config.js` is loading correctly.

## Required before final public launch

| Item | Exact location | Current safe behaviour | Action required |
|---|---|---|---|
| Final public domain or Render `.onrender.com` URL | `website/index.html` → canonical, `og:url`, `og:image`, `twitter:image` | Uses the reserved placeholder base `https://your-domain.example`. | Replace every occurrence with the final absolute URL, retaining `/assets/social-preview.png` in the two image metadata fields. Update and redeploy before promoting the site. |

## Optional content approval

| Item | Location | Status |
|---|---|---|
| Fuller PhotoHub case study | `website/index.html` → Portfolio | Only the supplied project name and offline status are presented. Add approved project details, visuals or a live link only after verifying them. No expansion is required for the honest offline listing. |

## Intentionally not placeholders

- **Prices:** No prices are published. Each project is scoped and quoted individually.
- **Physical address:** No unconfirmed address is shown. The site says only that Enkayjay serves small businesses in Ghana and beyond.
- **Testimonials, client counts, awards, certifications and project results:** None are included because none were supplied or verified.
- **Social-media profiles:** No unconfirmed social links are included.
- **Payment terms:** These must be approved by the business owner before sending client proposals; no deposit percentage has been invented.

## Template-only fields in outreach documents

The messages in `docs/CLIENT-ACQUISITION.md` still require personalisation such as `[Name]`, `[Business Name]`, `[Your Name]`, `[specific truthful observation]` and `[Final website link]`. The confirmed WhatsApp number and business email have already been inserted into the cold-email signature.

The contact details used for blank/placeholder configuration tests in `tests/browser-tests.js` are test-only values intercepted during automated testing. They do not replace the confirmed production settings.
