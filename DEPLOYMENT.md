# Deployment Guide

## GitHub Pages Setup

### Option 1: Automatic Deployment (Recommended)

The repository is already configured with GitHub Actions for automatic deployment.

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Build and deployment", select:
     - Source: **GitHub Actions**

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial portfolio setup"
   git push origin main
   ```

3. **Wait for deployment**:
   - Go to the "Actions" tab on GitHub
   - Watch the deployment workflow run
   - Once complete, your site will be live at: `https://<your-username>.github.io`

### Option 2: Manual Deployment

If you prefer manual deployment using gh-pages:

```bash
# Build and deploy
npm run deploy
```

This will:
1. Build the project
2. Create/update the `gh-pages` branch
3. Deploy to GitHub Pages

**Note**: For manual deployment, ensure GitHub Pages is set to deploy from the `gh-pages` branch in repository settings.

## Custom Domain (Optional)

1. Add a `CNAME` file in the `public/` directory:
   ```
   yourdomain.com
   ```

2. Configure DNS records with your domain provider:
   - Add an A record pointing to GitHub's IPs
   - Or add a CNAME record pointing to `<username>.github.io`

3. In GitHub Settings → Pages, add your custom domain

## Environment Variables

This portfolio doesn't require any environment variables. All configuration is done through JSON files in `src/data/`.

## Troubleshooting

### Build Fails
- Check Node.js version (requires v18+)
- Run `npm clean-install` to reinstall dependencies
- Check for TypeScript errors: `npm run build`

### Deployment Fails
- Ensure GitHub Actions has proper permissions
- Check the Actions tab for detailed error logs
- Verify the `dist` folder is being created correctly

### Blank Page After Deployment
- HashRouter is configured correctly for GitHub Pages
- Check browser console for errors
- Verify all paths are relative (no absolute paths starting with `/`)

## Production Checklist

Before deploying to production:

- [ ] Update `src/data/profile.json` with your real information
- [ ] Update `src/data/projects.json` with your actual projects
- [ ] Add real project images to `public/projects/`
- [ ] Update `src/data/experience.json` with your experience
- [ ] Update `src/data/certificates.json` with your certificates
- [ ] Update page title and meta description in `index.html`
- [ ] Test on multiple devices and browsers
- [ ] Run Lighthouse audit for performance/accessibility
- [ ] Verify all links work correctly

## Updating Content

To update your portfolio content after deployment:

1. Edit the JSON files in `src/data/`
2. Commit and push changes:
   ```bash
   git add src/data/
   git commit -m "Update portfolio content"
   git push origin main
   ```
3. GitHub Actions will automatically rebuild and redeploy

**No code changes needed!**
