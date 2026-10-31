# Website Testing Report

**Test date:** 31 October 2026  
**Project:** Enkayjay Digital Solutions  
**Result:** All completed static checks and **93 Chromium browser assertions passed**. The upgraded Portfolio, confirmed contact details and final Render URL are applied to the local source. The upgraded website and metadata still require owner-managed publication; this report does not describe them as live.

## What was inspected and preserved

The original HTML, stylesheet and JavaScript have all been reviewed. The one-page structure, section IDs, three service categories, five-step process, honest project-status labels, dependency-free approach and transparent enquiry-preparation concept were retained. The enhanced stylesheet also carries forward the original local font fallbacks and easing curve; the contact logic recognises the original explicit placeholder markers. See `ORIGINAL-FILES-REVIEW.md` for the full reconciliation.

The Portfolio upgrade is modular: existing `style.css` and `main.js` remain unchanged, while `portfolio.css`, `portfolio.js` and local WebP assets provide the new showcases. The business CTA and every non-Portfolio section remain in place.

## Static checks

| Check | Result |
|---|---|
| JavaScript syntax for `config.js`, `main.js` and `portfolio.js` | Pass |
| Duplicate HTML IDs | None found across 51 unique IDs |
| Internal section links | All 30 checked links resolve |
| Local CSS, JavaScript, icon and asset references | Pass; no missing referenced files |
| Gallery structure | Two galleries: four GigaRush screens and eight PhotoHub screens |
| Full-size and thumbnail file references | All 24 local WebP assets exist |
| Project access labels and links | GigaRush has the correct live URL; PhotoHub has no external project link |
| Form labels and `for` targets | Pass |
| `aria-controls` and `aria-describedby` references | Pass |
| CSS delimiter structure | Pass |
| HTML landmarks | One H1 and one main landmark confirmed |
| Sitemap XML and internal metadata references | Pass |

## Browser and responsive checks

Automated with Playwright using headless Chromium 156. Pages were also rendered to desktop and mobile screenshots and visually reviewed.

| Check | Result |
|---|---|
| 360 × 800 small-mobile viewport | Pass; no horizontal overflow |
| 390 × 844 mobile viewport | Pass; no horizontal overflow |
| 768 × 1024 tablet viewport | Pass; no horizontal overflow |
| 1024 × 768 small-desktop viewport | Pass; no horizontal overflow |
| 1440 × 1000 desktop viewport | Pass; no horizontal overflow |
| JavaScript runtime errors at all five sizes | None |
| Failed local asset requests at all five sizes | None |
| Mobile menu open/close and ARIA state | Pass |
| Escape closes menu and restores focus | Pass |
| Mobile link closes menu and reaches section | Pass |
| Service CTA preselects enquiry type | Pass |
| Native FAQ expand/collapse | Pass |
| Reduced-motion mode | Content remains visible; motion is removed |
| JavaScript-disabled fallback | Main content and services remain visible; all 12 screenshots remain available as direct links |
| Desktop and mobile visual review | Pass; clear hierarchy, readable content and aligned layouts |

## Portfolio gallery and lightbox tests

| Check | Result |
|---|---|
| Approved screenshot counts and ordering | Four GigaRush and eight PhotoHub screens present |
| All WebP assets in Chromium | All 24 full-size and thumbnail images load and decode |
| Thumbnail selection | Active image, caption, counter, orientation and `aria-current` update correctly |
| Desktop/mobile stage | Responsive framing and horizontal mobile thumbnail rail render correctly |
| Open active screenshot | Native dialog displays the selected image |
| Previous/next controls | Pass, including first/last wrapping |
| Keyboard controls | Left/right arrows navigate; Escape closes |
| Focus and scrolling | Focus returns to the originating screenshot; body scrolling is restored |
| Portrait containment | Portrait screenshots remain fully contained without extending beyond the viewer |
| Mobile swipe | Swipe advances to the next screenshot; no horizontal page overflow |
| Close button | Dismisses the viewer correctly |
| Failed portfolio requests | None |

A portrait-overflow issue found during visual review was corrected and retained as a regression test.

## Form and contact tests

| Check | Result |
|---|---|
| Empty form validation | Name, service, reply method and project-details errors shown correctly |
| Invalid email and phone validation | Pass |
| Valid enquiry preparation | Pass |
| Success-message honesty | Explicitly states that nothing has been sent |
| Blank configuration (test interception) | WhatsApp/email actions remain disabled and the reason is shown |
| Confirmed production WhatsApp | Correct `wa.me/233256800142` URL and encoded message generated |
| Confirmed production email | Correct `mailto:Enkayjay.skills2@gmail.com` URL, subject and encoded message generated |
| Original `233000000000` and `PLACEHOLDER_EMAIL` markers | Both remain disabled; setup notice stays visible |
| Prepared email subject | Includes the selected service and sender’s name |
| Copy enquiry | Complete prepared message copied successfully |
| Edit after preparation | Old prepared message is cleared and must be regenerated |
| Backend behaviour | No POST request; no fake submission or storage |

Production configuration tests used the confirmed business details without opening or sending either channel. Blank and original-placeholder states were tested separately through request interception.

## Accessibility and performance

- An automated **axe-core WCAG A/AA scan reported no violations** in the tested Chromium page state.
- Keyboard focus styles, a skip link, semantic landmarks, native FAQ controls, form labels, error associations and reduced-motion support are implemented.
- The lightbox uses a native dialog, labelled controls, keyboard navigation, focus restoration and a no-dialog fallback.
- Automated scanning does not prove full accessibility; final human testing with real devices and assistive technology is still recommended.
- Core HTML, CSS, JavaScript and favicon total approximately **116 KB uncompressed**.
- The entire public website folder contains **34 files** and is approximately **1.24 MB**, including all portfolio images and the 1200 × 630 social-sharing PNG.
- The **24 portfolio WebP assets total approximately 1.06 MB**; original PNG uploads are not included in the public package.
- The social PNG is approximately **63 KB**. It is used by sharing crawlers and is not part of the visible page payload.
- No external fonts, frameworks, trackers, tag managers or third-party front-end requests are used.

## SEO and sharing checks

- Unique SEO title and meta description are present.
- Canonical, Open Graph and Twitter metadata are present.
- The confirmed Render URL is applied to all four absolute URL fields in the source.
- Branded 1200 × 630 social-sharing image is included.
- `robots.txt` allows crawling and references the final absolute sitemap URL.
- `sitemap.xml` contains the canonical root URL and passes XML parsing.

## External read-only live checks

Performed against `https://enkayjay-digital-solutions.onrender.com/` on 30 October 2026:

| Check | Result |
|---|---|
| Public homepage | HTTP 200; expected website content returned |
| Confirmed WhatsApp/email links in live HTML | Present |
| Live social-sharing PNG | HTTP 200; `image/png`; 63,179 bytes |
| Live canonical/Open Graph/Twitter URLs | Older placeholder URLs still present at time of check |

The revised source package corrects those metadata URLs. The new Portfolio module has not been published or marked live. `https://gigarush.onrender.com/` was separately confirmed reachable during screenshot review; its current live-page claims were not copied into the portfolio copy.

## Remaining real-world checks

After the updated source is published, the owner should complete:

1. Upload the complete `website/` folder, preserving `css/portfolio.css`, `js/portfolio.js` and the `assets/portfolio/` directory.
2. Deliver actual WhatsApp and email enquiries using the confirmed business channels and real devices/apps.
3. Recheck the deployed canonical and social preview on the final public domain.
4. Run a final physical-device gallery/lightbox check on the owner’s phone and, where available, Safari and Firefox. Automated browser testing for this report was Chromium-based.
5. Add any future client quotes, measured results or new project claims only after separate verification and approval.

**Known code defects after testing:** None.  
**Required source placeholders:** None.  
**Remaining action:** Publish the complete upgraded website and metadata correction, then complete the owner-managed live delivery/device checks.
