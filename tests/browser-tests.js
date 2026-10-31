/*
 * Optional development tests — not required to run or deploy the website.
 * Install Playwright and axe-core, then run with Node.js.
 * The delivered website itself uses only HTML, CSS and vanilla JavaScript.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..', 'website');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) {
      res.writeHead(404).end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
});

function check(condition, message) {
  assert.ok(condition, message);
  console.log('PASS: ' + message);
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

  try {
    const viewports = [
      { name: 'small mobile', width: 360, height: 800 },
      { name: 'mobile', width: 390, height: 844 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'small desktop', width: 1024, height: 768 },
      { name: 'desktop', width: 1440, height: 1000 }
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: 'reduce'
      });
      const page = await context.newPage();
      const runtimeErrors = [];
      const failedRequests = [];
      page.on('pageerror', error => runtimeErrors.push(error.message));
      page.on('requestfailed', request => failedRequests.push(request.url()));
      const response = await page.goto(base, { waitUntil: 'networkidle' });
      check(response.status() === 200, `${viewport.name}: page loads successfully`);
      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        h1: document.querySelectorAll('h1').length,
        main: !!document.querySelector('main'),
        revealOpacity: getComputedStyle(document.querySelector('[data-reveal]')).opacity
      }));
      check(dimensions.document <= dimensions.viewport + 1 && dimensions.body <= dimensions.viewport + 1,
        `${viewport.name} (${viewport.width}px): no horizontal overflow`);
      check(dimensions.h1 === 1 && dimensions.main, `${viewport.name}: exactly one H1 and a main landmark`);
      check(dimensions.revealOpacity === '1', `${viewport.name}: reduced-motion content remains visible`);
      check(runtimeErrors.length === 0, `${viewport.name}: no JavaScript runtime errors`);
      check(failedRequests.length === 0, `${viewport.name}: no failed asset requests`);

      if (viewport.width === 390) {
        await page.screenshot({ path: path.join(__dirname, 'mobile-home.png'), fullPage: false });
        await page.screenshot({ path: path.join(__dirname, 'mobile-full.png'), fullPage: true });
      }
      if (viewport.width === 1440) {
        await page.screenshot({ path: path.join(__dirname, 'desktop-home.png'), fullPage: false });
        await page.screenshot({ path: path.join(__dirname, 'desktop-full.png'), fullPage: true });
      }
      await context.close();
    }

    // Mobile menu behaviour and keyboard dismissal.
    {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      await page.goto(base);
      await page.click('.nav-toggle');
      check(await page.getAttribute('.nav-toggle', 'aria-expanded') === 'true', 'mobile menu opens and updates aria-expanded');
      check(await page.locator('#mobile-menu').isVisible(), 'mobile menu is visible after opening');
      await page.keyboard.press('Escape');
      check(await page.getAttribute('.nav-toggle', 'aria-expanded') === 'false', 'Escape closes the mobile menu');
      check(await page.locator('.nav-toggle').evaluate(el => el === document.activeElement), 'Escape returns focus to the menu button');
      await page.click('.nav-toggle');
      await page.click('#mobile-menu a[href="#services"]');
      check(await page.getAttribute('.nav-toggle', 'aria-expanded') === 'false', 'selecting a mobile navigation link closes the menu');
      check(page.url().endsWith('#services'), 'mobile navigation updates the internal section link');
      await context.close();
    }

    // Portfolio galleries, project status and accessible lightbox.
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const failedRequests = [];
      page.on('requestfailed', request => failedRequests.push(request.url()));
      await page.goto(base);
      const giga = '[data-gallery="gigarush"]';
      const photo = '[data-gallery="photohub"]';
      check(await page.locator(giga + ' [data-gallery-thumb]').count() === 4, 'GigaRush gallery contains four approved screenshots');
      check(await page.locator(photo + ' [data-gallery-thumb]').count() === 8, 'PhotoHub gallery contains eight approved screenshots');
      const liveLink = page.locator('.project-showcase[aria-labelledby="gigarush-title"] a[href="https://gigarush.onrender.com"]');
      check(await liveLink.count() === 1, 'GigaRush has one correct live website link');
      check(await liveLink.getAttribute('target') === '_blank' && (await liveLink.getAttribute('rel')).includes('noopener'), 'GigaRush live link uses safe external-link behaviour');
      check(await page.locator('.project-showcase[aria-labelledby="photohub-title"] a[href^="http"]').count() === 0, 'PhotoHub preview has no live project link');
      check(await page.evaluate(async () => {
        const sources = [...document.querySelectorAll('[data-gallery-thumb]')].flatMap(link => [link.dataset.full, link.querySelector('img').src]);
        const loaded = await Promise.all(sources.map(source => new Promise(resolve => {
          const image = new Image();
          image.onload = () => resolve(image.naturalWidth > 0);
          image.onerror = () => resolve(false);
          image.src = source;
        })));
        return sources.length === 24 && loaded.every(Boolean);
      }), 'all 24 full-size and thumbnail WebP assets load and decode in Chromium');

      await page.locator(giga).scrollIntoViewIfNeeded();
      await page.waitForFunction(() => {
        const image = document.querySelector('[data-gallery="gigarush"] [data-gallery-image]');
        return image.complete && image.naturalWidth > 0;
      });
      await page.locator('.project-showcase[aria-labelledby="gigarush-title"]').screenshot({ path: path.join(__dirname, 'gigarush-showcase.png') });

      await page.click(giga + ' [data-index="1"]');
      await page.waitForFunction(() => document.querySelector('[data-gallery="gigarush"]').getAttribute('data-active-orientation') === 'mobile');
      check(await page.getAttribute(giga, 'data-active-orientation') === 'mobile', 'thumbnail selection switches the stage to mobile orientation');
      check((await page.textContent(giga + ' [data-gallery-caption]')).includes('Bundle selection'), 'gallery caption updates with the selected screenshot');
      check(await page.getAttribute(giga + ' [data-index="1"]', 'aria-current') === 'true', 'selected thumbnail exposes its current state');
      check(await page.locator(giga + ' [data-gallery-image]').evaluate(image => image.complete && image.naturalWidth > 0), 'selected full-size WebP image loads successfully');

      await page.click(giga + ' [data-gallery-open]');
      check(await page.locator('#portfolio-lightbox').evaluate(dialog => dialog.open), 'active screenshot opens the native lightbox dialog');
      check(await page.locator('body').evaluate(body => body.classList.contains('lightbox-open')), 'lightbox prevents background scrolling');
      check((await page.getAttribute('#lightbox-image', 'src')).includes('checkout-mobile.webp'), 'lightbox opens the currently selected screenshot');
      check(await page.evaluate(() => {
        const image = document.querySelector('#lightbox-image');
        const stage = document.querySelector('.lightbox-stage');
        const imageRect = image.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        return getComputedStyle(image).objectFit === 'contain' && imageRect.bottom <= stageRect.bottom + 1 && imageRect.right <= stageRect.right + 1;
      }), 'portrait screenshot is fully contained within the lightbox stage');
      await page.keyboard.press('ArrowRight');
      check((await page.textContent('#lightbox-caption')).includes('Partner workspace'), 'right arrow advances to the next screenshot');
      check(await page.textContent('#lightbox-counter') === '03 / 04', 'lightbox counter updates during keyboard navigation');
      await page.keyboard.press('ArrowLeft');
      check((await page.getAttribute('#lightbox-image', 'src')).includes('checkout-mobile.webp'), 'left arrow returns to the previous screenshot');
      await page.keyboard.press('Escape');
      check(!(await page.locator('#portfolio-lightbox').evaluate(dialog => dialog.open)), 'Escape closes the lightbox');
      check(!(await page.locator('body').evaluate(body => body.classList.contains('lightbox-open'))), 'closing the lightbox restores page scrolling');
      check(await page.locator(giga + ' [data-gallery-open]').evaluate(link => link === document.activeElement), 'lightbox close restores focus to the originating screenshot');

      await page.locator(photo).scrollIntoViewIfNeeded();
      await page.waitForFunction(() => {
        const image = document.querySelector('[data-gallery="photohub"] [data-gallery-image]');
        return image.complete && image.naturalWidth > 0;
      });
      await page.locator('.project-showcase[aria-labelledby="photohub-title"]').screenshot({ path: path.join(__dirname, 'photohub-showcase.png') });
      await page.click(photo + ' [data-index="7"]');
      await page.waitForFunction(() => document.querySelector('[data-gallery="photohub"] [data-gallery-counter]').textContent === '08 / 08');
      check(await page.textContent(photo + ' [data-gallery-counter]') === '08 / 08', 'PhotoHub gallery reaches its eighth approved screenshot');
      await page.click(photo + ' [data-gallery-open]');
      await page.click('[data-lightbox-next]');
      check(await page.textContent('#lightbox-counter') === '01 / 08', 'lightbox next wraps from the last screenshot to the first');
      await page.click('[data-lightbox-prev]');
      check(await page.textContent('#lightbox-counter') === '08 / 08', 'lightbox previous wraps from the first screenshot to the last');
      await page.click('[data-lightbox-close]');
      check(!(await page.locator('#portfolio-lightbox').evaluate(dialog => dialog.open)), 'lightbox close button dismisses the viewer');
      check(failedRequests.length === 0, 'portfolio galleries have no failed image or asset requests');
      await context.close();
    }

    // Small-screen lightbox containment and touch navigation.
    {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(base);
      await page.click('[data-gallery="gigarush"] [data-gallery-open]');
      await page.locator('[data-lightbox-stage]').evaluate(stage => {
        const start = new Touch({ identifier: 1, target: stage, clientX: 300, clientY: 350 });
        stage.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [start], changedTouches: [start] }));
        const end = new Touch({ identifier: 1, target: stage, clientX: 100, clientY: 350 });
        stage.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [end] }));
      });
      await page.waitForFunction(() => document.querySelector('#lightbox-counter').textContent === '02 / 04');
      check(await page.textContent('#lightbox-counter') === '02 / 04', 'mobile swipe advances the lightbox to the next screenshot');
      check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'open mobile lightbox does not create horizontal page overflow');
      await page.click('[data-lightbox-close]');
      await context.close();
    }

    // Form validation, preparation, invalidation and clipboard fallback.
    {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        permissions: ['clipboard-read', 'clipboard-write']
      });
      const page = await context.newPage();
      const postRequests = [];
      page.on('request', request => { if (request.method() === 'POST') postRequests.push(request.url()); });
      await page.route('**/js/config.js', route => route.fulfill({
        contentType: 'text/javascript',
        body: 'window.ENKAYJAY_CONFIG={whatsappNumber:"",whatsappDisplay:"",email:""};'
      }));
      await page.goto(base);
      await page.click('.service-card [data-service="Digital system"]');
      check(await page.inputValue('#project-type') === 'Digital system', 'service CTA preselects the correct enquiry type');
      await page.reload();
      await page.click('#enquiry-form button[type="submit"]');
      check((await page.textContent('#name-error')).length > 0, 'empty form shows a name validation error');
      check((await page.textContent('#project-type-error')).length > 0, 'empty form shows a service validation error');
      check((await page.textContent('#contact-error')).length > 0, 'empty form requires at least one reply method');
      check((await page.textContent('#message-error')).length > 0, 'empty form shows a project-details validation error');
      check(await page.locator('#form-success').isHidden(), 'invalid form does not show a success state');

      await page.fill('#name', 'Test User');
      await page.selectOption('#project-type', 'Business website');
      await page.fill('#email', 'not-an-email');
      await page.fill('#phone', 'abc');
      await page.fill('#message', 'I need a professional website for my small business.');
      await page.click('#enquiry-form button[type="submit"]');
      check((await page.textContent('#email-error')).length > 0, 'invalid email is rejected');
      check((await page.textContent('#phone-error')).length > 0, 'invalid phone number is rejected');

      await page.fill('#email', 'test@example.com');
      await page.fill('#phone', '');
      await page.click('#enquiry-form button[type="submit"]');
      check(await page.locator('#form-success').isVisible(), 'valid form displays the enquiry-ready panel');
      check((await page.textContent('#enquiry-ready-title')).includes('nothing has been sent'), 'prepared state clearly says nothing was sent');
      check(await page.getAttribute('#open-whatsapp', 'href') === null, 'WhatsApp send stays unavailable with blank configuration');
      check(await page.getAttribute('#open-email', 'href') === null, 'email send stays unavailable with blank configuration');
      check(await page.locator('#form-success-warning').isVisible(), 'missing contact configuration is explained in the prepared panel');
      await page.click('#copy-enquiry');
      await page.waitForFunction(() => document.querySelector('#copy-enquiry').textContent.includes('Copied'));
      const clipboard = await page.evaluate(() => navigator.clipboard.readText());
      check(clipboard.includes('Test User') && clipboard.includes('Business website'), 'Copy enquiry copies the complete prepared message');
      await page.fill('#message', 'I need a professional website for my small business and online shop.');
      check(await page.locator('#form-success').isHidden(), 'editing a prepared form invalidates the old prepared message');
      check(postRequests.length === 0, 'form preparation makes no POST request and pretends no backend submission');
      await context.close();
    }

    // Original project's explicit placeholder markers must never activate contact links.
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      await page.route('**/js/config.js', route => route.fulfill({
        contentType: 'text/javascript',
        body: 'window.ENKAYJAY_CONFIG={whatsappNumber:"233000000000",whatsappDisplay:"PLACEHOLDER",email:"PLACEHOLDER_EMAIL"};'
      }));
      await page.goto(base);
      check(await page.getAttribute('#whatsapp-enquiry', 'href') === null, 'original WhatsApp placeholder marker stays disabled');
      check(await page.getAttribute('#email-enquiry', 'href') === null, 'original email placeholder marker stays disabled');
      check(await page.locator('#contact-setup-note').isVisible(), 'original placeholder markers retain the setup notice');
      await context.close();
    }

    // Delivered confirmed contact configuration; no messages are opened or sent.
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      await page.goto(base);
      const directWhatsapp = await page.getAttribute('#whatsapp-enquiry', 'href');
      const directEmail = await page.getAttribute('#email-enquiry', 'href');
      check(directWhatsapp.startsWith('https://wa.me/233256800142?text='), 'confirmed WhatsApp creates a prefilled wa.me link');
      check(directEmail.startsWith('mailto:Enkayjay.skills2@gmail.com?subject='), 'confirmed business email creates a prefilled mailto link');
      check(await page.locator('#contact-setup-note').isHidden(), 'setup notice hides when both contact channels are configured');
      await page.fill('#name', 'Configured Test');
      await page.selectOption('#project-type', 'Digital product');
      await page.fill('#email', 'sender@example.com');
      await page.fill('#message', 'I would like to discuss a focused digital product for my customers.');
      await page.click('#enquiry-form button[type="submit"]');
      const preparedWhatsapp = await page.getAttribute('#open-whatsapp', 'href');
      const preparedEmail = await page.getAttribute('#open-email', 'href');
      check(preparedWhatsapp.includes(encodeURIComponent('Configured Test')), 'prepared WhatsApp link contains the enquiry');
      check(preparedEmail.includes(encodeURIComponent('Configured Test')), 'prepared email link contains the enquiry');
      check(decodeURIComponent(preparedEmail).includes('Project enquiry — Digital product — Configured Test'), 'prepared email subject identifies the service and sender');
      await context.close();
    }

    // Native FAQ and automated WCAG A/AA checks.
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(base);
      await page.click('.faq-list details:first-child summary');
      check(await page.locator('.faq-list details:first-child').getAttribute('open') !== null, 'FAQ expands using native accessible details/summary');
      const axePath = require.resolve('axe-core/axe.min.js');
      await page.addScriptTag({ path: axePath });
      const axeResults = await page.evaluate(async () => axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
      }));
      if (axeResults.violations.length) {
        console.log(JSON.stringify(axeResults.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })), null, 2));
      }
      check(axeResults.violations.length === 0, 'automated axe WCAG A/AA scan reports no violations');
      await context.close();
    }

    // No-JavaScript content fallback.
    {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      await page.goto(base);
      check(await page.locator('h1').isVisible(), 'primary content remains visible with JavaScript disabled');
      check(await page.locator('#services').isVisible(), 'services remain visible with JavaScript disabled');
      check(await page.locator('[data-gallery-thumb]').evaluateAll(links => links.length === 12 && links.every(link => link.getAttribute('href').endsWith('.webp'))), 'all twelve portfolio screenshots remain available as direct links without JavaScript');
      await context.close();
    }

    console.log('\nALL BROWSER TESTS PASSED');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => {
  console.error(error.stack || error);
  server.close();
  process.exit(1);
});
