# Remaining Placeholders and Confirmations

## Confirmed and applied

| Item | Applied value | Result |
|---|---|---|
| Business WhatsApp | `233256800142` in `website/js/config.js`; displayed as `+233256800142` | Direct and prepared-enquiry WhatsApp links activate. Real delivery still requires an owner-managed live test. |
| Monitored business email | `Enkayjay.skills2@gmail.com` in `website/js/config.js` | Direct and prepared-enquiry email links activate. Real delivery still requires an owner-managed live test. |
| Hosting preference | Render | A public Render site is confirmed. Owner-managed Static Site instructions are included in `RENDER-DEPLOYMENT.md`; no service was connected or modified by the assistant. |
| Final public URL | `https://enkayjay-digital-solutions.onrender.com` | Applied to the canonical URL, `og:url`, `og:image` and `twitter:image` in the source package. The outreach signature also uses this URL. |

The contact setup notice should disappear when JavaScript loads with these confirmed settings. If it remains visible during a real browser check, check that `js/config.js` is loading correctly.

## Required source placeholders

**None.** All required contact and public-URL placeholders in the source package have been completed.

### Live metadata publication still required

An external read-only check on 30 October 2026 confirmed that the public homepage and social image return HTTP 200. The live HTML still contained the older `https://your-domain.example` metadata at that check. The revised source now has the correct Render URL; publish the updated `website/index.html` before running the final social-sharing validators.

## Optional content approval

| Item | Location | Status |
|---|---|---|
| Additional project case-study claims | `website/index.html` → Portfolio | The approved GigaRush and PhotoHub screenshot showcases are complete. Add client quotes, measured results, further technical claims or a PhotoHub live link only if separately verified and approved; none is required for the current portfolio. |

## Intentionally not placeholders

- **Prices:** No prices are published. Each project is scoped and quoted individually.
- **Physical address:** No unconfirmed address is shown. The site says only that Enkayjay serves small businesses in Ghana and beyond.
- **Testimonials, client counts, awards, certifications and project results:** None are included because none were supplied or verified.
- **Social-media profiles:** No unconfirmed social links are included.
- **Payment terms:** These must be approved by the business owner before sending client proposals; no deposit percentage has been invented.

## Template-only fields in outreach documents

The messages in `docs/CLIENT-ACQUISITION.md` still require personalisation such as `[Name]`, `[Business Name]`, `[Your Name]` and `[specific truthful observation]`. The confirmed WhatsApp number, business email and public website URL have already been inserted into the cold-email signature.

The contact details used for blank/placeholder configuration tests in `tests/browser-tests.js` are test-only values intercepted during automated testing. They do not replace the confirmed production settings.
