# Render Deployment Guide — Owner-Managed

**Hosting choice:** Render  
**Required service:** Static Site  
**Backend, database, start command and build tools:** None required

No Render service, GitHub repository or external account has been connected, created or changed by this project.

## Important: Render deployment is not ordinary ZIP uploading

Render’s public documentation describes creating a Static Site from a linked Git repository. Its **Manual Deploy** options trigger deployment from a linked commit; they do not turn the dashboard into a general ZIP-file upload tool.

If you do not use GitHub, use a repository workflow you already control and are comfortable with, such as an existing GitLab or Bitbucket repository. You will perform any repository upload and Render connection yourself. If you require a strictly ZIP-only workflow with no Git repository, verify that option in your Render account before proceeding; it is not the workflow described in Render’s public Static Site documentation.

## Recommended project layout

Keep the complete extracted package as the repository root and publish only the `website` folder. This keeps business documents and optional tests out of the public site.

```text
repository-root/
├── README.md
├── docs/
├── tests/
└── website/              ← Publish this directory only
    ├── index.html
    ├── robots.txt
    ├── assets/
    ├── css/
    └── js/
```

## Render settings

| Setting | Value |
|---|---|
| Service type | **Static Site** |
| Repository | One you choose and provide yourself |
| Branch | Your chosen deployment branch |
| Build Command | **Leave blank** — the website is already built |
| Publish Directory | **website** |
| Start Command | Not applicable for a Static Site |
| Environment variables | None required |
| Database | None |

Do not set the publish directory to the full package root. Doing so could expose documentation and test files unnecessarily.

## Deployment sequence

1. Extract the complete ZIP.
2. Preview `website/index.html` locally and confirm the WhatsApp/email buttons work.
3. If you already know the final public URL, replace every `https://your-domain.example` occurrence in `website/index.html` now. Otherwise, continue and perform this step when Render gives you the default URL.
4. Using your own chosen repository workflow, make the **full package** available to Render. No GitHub connection is required by this project.
5. In your own Render Dashboard, choose **New → Static Site** and select your repository.
6. Leave **Build Command** blank and set **Publish Directory** to `website`.
7. Create/deploy the Static Site yourself.
8. Copy the assigned `https://your-service.onrender.com` URL, or use your confirmed custom domain if you have one.
9. If the metadata still contains `https://your-domain.example`, replace every occurrence with that final URL. Preserve `/assets/social-preview.png` in the two image metadata fields.
10. Update the source through your chosen workflow and redeploy the corrected version.
11. Treat the deployment as unfinished until all live checks below pass.

## Live checks

- [ ] Homepage and all local CSS/JavaScript/assets load over HTTPS
- [ ] Mobile menu opens, closes and reaches every section
- [ ] WhatsApp opens a conversation for **+233256800142** with a prefilled message
- [ ] Email opens a draft addressed to **Enkayjay.skills2@gmail.com**
- [ ] The form validates errors and prepares an enquiry without claiming automatic submission
- [ ] One real WhatsApp enquiry is sent by you and received
- [ ] One real email enquiry is sent by you and received
- [ ] Copy enquiry works on your phone and desktop browser
- [ ] Canonical and Open Graph URLs match the final public URL
- [ ] `https://YOUR-FINAL-DOMAIN/assets/social-preview.png` opens the branded image
- [ ] Social-sharing preview is checked after the final metadata is live
- [ ] The contact setup notice is no longer visible

## Updating the website

Update the files through the same owner-controlled source workflow, then deploy using your chosen automatic or manual Render setting. Do not pay for a backend, database, form service or build dependency for this version.

## Official references

- [Render Static Sites](https://render.com/docs/static-sites)
- [Deploying on Render](https://render.com/docs/deploys)
