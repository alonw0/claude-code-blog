# Vercel Deployment Guide

## Pre-Deployment Checklist

- [x] `vercel.json` configuration created
- [x] `.vercelignore` file created
- [x] Build scripts configured in `package.json`
- [x] Astro config has placeholder site URL
- [x] All dependencies installed
- [x] Production build tested locally

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repo
   - Vercel will auto-detect: Framework = **Astro**

3. **Configure (if needed)**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)
   - **No environment variables needed**

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for first build
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # From your project directory
   vercel

   # Follow prompts:
   # - Set up and deploy? Yes
   # - Which scope? Select your account
   # - Link to existing project? No
   # - Project name? (use default or customize)
   # - Directory? ./ (press Enter)
   ```

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

## Post-Deployment Configuration

### 1. Update Site URL

After your first deployment, update `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://your-actual-domain.vercel.app', // Replace with your Vercel URL
  // ...
});
```

Then redeploy:
```bash
git add astro.config.mjs
git commit -m "Update production URL"
git push origin main
```

Vercel will auto-deploy the update.

### 2. Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `astro.config.mjs` with custom domain
6. Redeploy

### 3. Environment Variables (If Needed)

Currently, this project doesn't require any environment variables. If you add features that need them:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables for Production, Preview, and Development
3. Redeploy to apply

## Vercel Build Configuration

These settings are automatically detected from `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "devCommand": "npm run dev"
}
```

## Automatic Deployments

Vercel will automatically deploy:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches and PRs

## Build Performance

Expected build time: **2-3 minutes**

Build steps:
1. Install dependencies (~30s)
2. Build Astro site (~60s)
   - Fetch RSS feeds
   - Fetch changelog
   - Generate static pages
   - Build assets
3. Deploy to edge network (~30s)

## Troubleshooting

### Build Fails

**Check build logs in Vercel Dashboard:**
- Look for npm errors
- Check for missing dependencies
- Verify Node version (should be 18+)

**Common fixes:**
```bash
# Clear node_modules and rebuild locally
rm -rf node_modules package-lock.json
npm install
npm run build

# If it works locally, push to trigger rebuild
git commit --allow-empty -m "Trigger rebuild"
git push
```

### RSS/Changelog Not Loading

These features fetch from external URLs at build time. If they fail:
- Check if GitHub is accessible from Vercel
- Builds will continue with graceful fallbacks
- No action needed unless critical

### Sitemap URLs Wrong

Update `site` in `astro.config.mjs` and redeploy.

### Favicons Not Showing

Ensure `/public` directory is committed to Git:
```bash
git add public/
git commit -m "Add favicons"
git push
```

## Monitoring

### Analytics (Optional)

Enable Vercel Analytics:
1. Go to your project settings
2. Enable "Analytics"
3. View page views, performance metrics

### Speed Insights (Optional)

Enable Vercel Speed Insights:
1. Install package: `npm install @vercel/speed-insights`
2. Add to layout component
3. Redeploy

## Deployment Status

You can check deployment status:
- Vercel Dashboard: [vercel.com](https://vercel.com)
- GitHub: Check commit status badges
- CLI: `vercel ls`

## Rollback

If something goes wrong:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

## Production Checklist

Before going live:

- [ ] Test all pages load correctly
- [ ] Check blog posts render properly
- [ ] Verify RSS feed works
- [ ] Test news slider
- [ ] Check changelog viewer
- [ ] Verify author pages
- [ ] Test tag filtering
- [ ] Check favicon displays
- [ ] Test dark/light mode
- [ ] Verify responsive design on mobile
- [ ] Check sitemap.xml
- [ ] Test social sharing (OG images)

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Astro Docs**: [docs.astro.build](https://docs.astro.build)
- **Issues**: [GitHub Issues](https://github.com/alonw0/claude-code-blog/issues)

---

**Ready to deploy?** Just push to GitHub and Vercel will handle the rest! 🚀
