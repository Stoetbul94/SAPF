# Deployment Guide

Complete step-by-step instructions for deploying the SAPF static website to GitHub Pages and Vercel.

---

## Table of Contents

1. [GitHub Pages Deployment](#github-pages-deployment)
2. [Vercel Deployment](#vercel-deployment)
3. [Updating After Changes](#updating-after-changes)
4. [Troubleshooting](#troubleshooting)

---

## GitHub Pages Deployment

### Prerequisites

- GitHub account (free tier works)
- Git installed on your computer
- Basic command line knowledge

### Step 1: Prepare Your Local Repository

#### 1.1 Initialize Git (if not already done)

Open your terminal/command prompt in the SAPF project directory and run:

```bash
git init
git add .
git commit -m "Initial commit: SAPF website"
```

**Expected Output:**
```
Initialized empty Git repository in C:/Users/YourName/Desktop/SAPF/.git/
[main (root-commit) abc1234] Initial commit: SAPF website
 25 files changed, 5000+ insertions(+)
```

#### 1.2 Verify .nojekyll File Exists

Check that `.nojekyll` file is present in the root directory:

```bash
# Windows PowerShell
Get-ChildItem -Filter ".nojekyll"

# Linux/Mac
ls -la .nojekyll
```

**Expected Output:**
```
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---          1/15/2024   2:30 PM              0 .nojekyll
```

**Why this matters:** The `.nojekyll` file tells GitHub Pages not to process the site with Jekyll, which is required for static HTML sites. Without it, GitHub Pages may not serve your files correctly.

---

### Step 2: Create GitHub Repository

#### 2.1 Create New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**

**Screenshot Description:**
- You should see a "New repository" page with form fields
- Repository name field at the top
- Description field (optional)
- Public/Private radio buttons
- Checkboxes for README, .gitignore, and license (leave these UNCHECKED)

#### 2.2 Configure Repository

Fill in the form:
- **Repository name:** `sapf` (or your preferred name)
- **Description:** "South African Pistol Federation Website" (optional)
- **Visibility:** Select **Public** (required for free GitHub Pages)
- **DO NOT** check:
  - ❌ Add a README file
  - ❌ Add .gitignore
  - ❌ Choose a license

**Screenshot Description:**
- Repository name field shows: `sapf`
- Public radio button is selected
- All three checkboxes are unchecked
- Green "Create repository" button at the bottom

#### 2.3 Create Repository

Click the green **"Create repository"** button.

**Expected Result:**
- You'll be redirected to an empty repository page
- URL will be: `https://github.com/YOUR_USERNAME/sapf`
- You'll see instructions for pushing an existing repository

---

### Step 3: Push Code to GitHub

#### 3.1 Connect Local Repository to GitHub

In your terminal, run these commands (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sapf.git
git push -u origin main
```

**Expected Output:**
```
Branch 'main' set up to track remote branch 'main' from 'origin'.
Enumerating objects: 25, done.
Counting objects: 100% (25/25), done.
Delta compression using up to 8 threads
Compressing objects: 100% (20/20), done.
Writing objects: 100% (25/25), 150.5 KiB | 2.5 MiB/s, done.
Total 25 (delta 3), reused 0 (delta 0), pack-reused 0
To https://github.com/YOUR_USERNAME/sapf.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**If prompted for credentials:**
- Use a Personal Access Token (not your password)
- Generate one at: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Required scopes: `repo` (full control of private repositories)

---

### Step 4: Enable GitHub Pages

#### 4.1 Navigate to Pages Settings

1. In your GitHub repository, click the **"Settings"** tab (top navigation)
2. Scroll down to **"Pages"** in the left sidebar (under "Code and automation")

**Screenshot Description:**
- Settings page with left sidebar menu
- "Pages" option visible in the sidebar
- Main content area shows "GitHub Pages" configuration

#### 4.2 Configure GitHub Pages

Under **"Source"**:
1. Select **Branch:** `main` (from dropdown)
2. Select **Folder:** `/ (root)` (from dropdown)
3. Click **"Save"** button

**Screenshot Description:**
- "Source" section with two dropdowns
- First dropdown shows: `main` (selected)
- Second dropdown shows: `/ (root)` (selected)
- Green "Save" button at the bottom

**Expected Result:**
- A green success message appears: "Your site is ready to be published at..."
- You'll see a notice: "Your site is published at `https://YOUR_USERNAME.github.io/sapf/`"

#### 4.3 Wait for Build

- **Build time:** 1-2 minutes (usually less)
- **Status indicator:** You'll see a yellow/orange dot next to the URL while building
- **When ready:** The dot turns green and says "Your site is live"

**Expected URL:**
```
https://YOUR_USERNAME.github.io/sapf/
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username. For example:
- If your username is `johndoe`, your site will be at: `https://johndoe.github.io/sapf/`

---

### Step 5: Update Canonical URLs

#### 5.1 Find All Canonical URLs

All HTML files contain canonical URLs that need to be updated. Currently they reference:
```
https://yourusername.github.io/sapf/
```

#### 5.2 Update Canonical URLs

**Option A: Manual Find and Replace (Recommended for beginners)**

1. Open each HTML file in your editor
2. Find: `https://yourusername.github.io/sapf/`
3. Replace with: `https://YOUR_USERNAME.github.io/sapf/`
4. Save the file

**Files to update:**
- `index.html`
- `about.html`
- `disciplines.html`
- `events.html`
- `results.html`
- `documents.html`
- `gallery.html`
- `contact.html`
- `terms.html`
- `privacy.html`

**Option B: Command Line (PowerShell - Windows)**

```powershell
Get-ChildItem -Filter "*.html" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'yourusername', 'YOUR_USERNAME' | Set-Content $_.FullName
}
```

**Option C: Command Line (Bash - Linux/Mac)**

```bash
find . -name "*.html" -type f -exec sed -i 's/yourusername/YOUR_USERNAME/g' {} +
```

#### 5.3 Commit and Push Changes

```bash
git add *.html
git commit -m "Update canonical URLs with actual GitHub Pages URL"
git push
```

**Expected Output:**
```
[main abc1234] Update canonical URLs with actual GitHub Pages URL
 10 files changed, 10 insertions(+), 10 deletions(-)
To https://github.com/YOUR_USERNAME/sapf.git
   def5678..abc1234  main -> main
```

#### 5.4 Verify Canonical URLs

After pushing, wait 1-2 minutes, then:
1. Visit your live site: `https://YOUR_USERNAME.github.io/sapf/`
2. View page source (Right-click → View Page Source)
3. Check the `<link rel="canonical">` tag in the `<head>` section
4. Verify it shows your actual URL, not `yourusername`

---

### Step 6: Verify Deployment

#### 6.1 Test Your Live Site

Visit: `https://YOUR_USERNAME.github.io/sapf/`

**Checklist:**
- [ ] Homepage loads correctly
- [ ] Navigation menu works
- [ ] All pages are accessible
- [ ] JSON data loads (events, results, documents, gallery)
- [ ] Images display correctly
- [ ] Contact form is functional
- [ ] Mobile responsive design works
- [ ] No console errors (F12 → Console tab)

#### 6.2 Expected Homepage Elements

When you visit the homepage, you should see:
- SAPF logo and header
- Hero section with tagline
- Navigation menu
- Upcoming Events section (populated from JSON)
- Latest Results section (populated from JSON)
- Featured Disciplines section
- Footer with contact information

---

## Vercel Deployment

### Prerequisites

- Vercel account (free tier available)
- GitHub repository (already created from previous steps)
- OR Vercel CLI installed (for CLI method)

---

### Option 1: Vercel via GitHub Integration (Recommended)

#### Step 1: Sign Up / Sign In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**

**Screenshot Description:**
- Vercel homepage with "Sign Up" button
- Or login page with "Continue with GitHub" button
- GitHub authorization popup appears

#### Step 2: Authorize Vercel

1. GitHub will ask for authorization
2. Review permissions (Vercel needs access to your repositories)
3. Click **"Authorize Vercel"**

**Screenshot Description:**
- GitHub authorization page
- Lists permissions Vercel is requesting
- Green "Authorize Vercel" button at bottom

#### Step 3: Import Repository

1. After logging in, you'll see the Vercel dashboard
2. Click **"Add New..."** button (top right)
3. Select **"Project"**

**Screenshot Description:**
- Vercel dashboard with "Add New..." dropdown
- "Project" option in the dropdown menu

#### Step 4: Select Repository

1. You'll see a list of your GitHub repositories
2. Find and click on **"sapf"** (or your repository name)
3. Click **"Import"** button

**Screenshot Description:**
- List of GitHub repositories
- Search bar at top
- "sapf" repository visible in the list
- "Import" button next to the repository name

#### Step 5: Configure Project

**Project Settings:**
- **Project Name:** `sapf` (or leave default)
- **Framework Preset:** Select **"Other"** or **"Other (Static Site)"**
- **Root Directory:** Leave as `./` (root)
- **Build Command:** Leave empty (no build needed)
- **Output Directory:** Leave empty (serves from root)

**Screenshot Description:**
- Project configuration form
- Framework Preset dropdown showing "Other" selected
- Root Directory field showing `./`
- Build Command and Output Directory fields are empty
- "Deploy" button at bottom

#### Step 6: Deploy

1. Click the **"Deploy"** button
2. Wait for deployment (usually 10-30 seconds)

**Expected Output:**
- Deployment progress bar appears
- Status shows "Building..." then "Deploying..."
- Success message: "Your deployment is ready!"

#### Step 7: Access Your Site

**Expected URLs:**
- **Production URL:** `https://sapf.vercel.app`
- **Custom URL:** `https://sapf-YOUR_USERNAME.vercel.app`

**Screenshot Description:**
- Deployment success page
- Large green checkmark
- "Visit" button linking to your live site
- Deployment URL displayed prominently

**Note:** Vercel automatically generates a URL based on your project name. You can customize it in project settings.

---

### Option 2: Vercel CLI Deployment

#### Step 1: Install Vercel CLI

**Using npm (Node.js required):**

```bash
npm install -g vercel
```

**Expected Output:**
```
+ vercel@28.0.0
added 1 package in 5s
```

**Verify Installation:**
```bash
vercel --version
```

**Expected Output:**
```
28.0.0
```

#### Step 2: Login to Vercel

```bash
vercel login
```

**Expected Output:**
```
Vercel CLI 28.0.0
? Set up and deploy "~/Desktop/SAPF"? [Y/n] y
? Which scope do you want to deploy to? [Use arrows to move, type to filter]
> Your Account
```

Follow the prompts:
1. Confirm deployment: Type `Y` and press Enter
2. Select scope: Choose your account
3. Browser will open for authentication
4. Authorize Vercel in the browser
5. Return to terminal

**Expected Output:**
```
> Success! Authentication complete.
```

#### Step 3: Deploy

In your project directory:

```bash
vercel
```

**First-time deployment prompts:**
```
? Set up and deploy "~/Desktop/SAPF"? [Y/n] y
? Which scope do you want to deploy to? Your Account
? Link to existing project? [y/N] n
? What's your project's name? sapf
? In which directory is your code located? ./
```

**Expected Output:**
```
🔍  Inspect: https://vercel.com/YOUR_USERNAME/sapf/abc123
✅  Production: https://sapf.vercel.app [copied to clipboard]
```

#### Step 4: Production Deployment

For production deployment (assigns custom domain):

```bash
vercel --prod
```

**Expected Output:**
```
🔍  Inspect: https://vercel.com/YOUR_USERNAME/sapf/def456
✅  Production: https://sapf.vercel.app [copied to clipboard]
```

---

### Vercel Configuration File (Optional)

Create `vercel.json` in the root directory for advanced configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

This configuration:
- Serves all files as static files
- Adds security headers
- Handles routing correctly

---

## Updating After Changes

### GitHub Pages Updates

#### Step 1: Make Changes Locally

Edit files (HTML, CSS, JS, or JSON) in your local project directory.

#### Step 2: Commit Changes

```bash
git add .
git commit -m "Update: description of your changes"
```

**Example:**
```bash
git add data/events.json
git commit -m "Update: Add March 2024 competition event"
```

**Expected Output:**
```
[main abc1234] Update: Add March 2024 competition event
 1 file changed, 15 insertions(+), 2 deletions(-)
```

#### Step 3: Push to GitHub

```bash
git push
```

**Expected Output:**
```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 450 bytes | 450.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0), pack-reused 0
To https://github.com/YOUR_USERNAME/sapf.git
   def5678..abc1234  main -> main
```

#### Step 4: Wait for GitHub Pages Build

- **Build time:** 1-2 minutes
- **Check status:** Go to repository → Settings → Pages
- **Verify:** Visit your site URL to see changes

**Note:** GitHub Pages automatically rebuilds when you push to the `main` branch.

---

### Vercel Updates

#### Automatic Updates (GitHub Integration)

If you deployed via GitHub integration, Vercel automatically deploys when you push to GitHub:

1. **Push to GitHub** (as shown above)
2. **Vercel detects changes** automatically
3. **New deployment starts** (check Vercel dashboard)
4. **Deployment completes** in 10-30 seconds
5. **Site updates** automatically

**Check Deployment Status:**
- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Click on your project
- View "Deployments" tab
- See deployment status and logs

#### Manual Updates (CLI)

If you deployed via CLI and want to update manually:

```bash
vercel --prod
```

**Expected Output:**
```
🔍  Inspect: https://vercel.com/YOUR_USERNAME/sapf/ghi789
✅  Production: https://sapf.vercel.app [copied to clipboard]
```

---

### Common Update Scenarios

#### Updating Events

```bash
# Edit data/events.json
git add data/events.json
git commit -m "Update: Add new competition event"
git push
```

**Expected Result:**
- New event appears on `events.html` page
- Event shows in homepage "Upcoming Events" section
- Changes visible within 1-2 minutes (GitHub Pages) or 10-30 seconds (Vercel)

#### Updating Results

```bash
# Edit data/results.json
git add data/results.json
git commit -m "Update: Add competition results"
git push
```

**Expected Result:**
- New results appear in results table
- National logs updated if applicable
- PDF links work correctly

#### Adding Gallery Images

```bash
# 1. Add image file to assets/images/gallery/
# 2. Update data/gallery.json
git add assets/images/gallery/new-image.jpg data/gallery.json
git commit -m "Update: Add new gallery image"
git push
```

**Expected Result:**
- New image appears in gallery grid
- Image loads with lazy loading
- Lightbox works when clicking image

#### Updating Documents

```bash
# 1. Add PDF to documents/ directory
# 2. Update data/documents.json
git add documents/rulebooks/new-rulebook.pdf data/documents.json
git commit -m "Update: Add 2024 rulebook"
git push
```

**Expected Result:**
- New document appears in documents library
- Document card shows correct information
- PDF download link works

---

## Troubleshooting

### GitHub Pages Issues

#### Site Not Building

**Symptoms:**
- Site shows 404 error
- "Page build failed" message in Settings → Pages

**Solutions:**
1. **Verify `.nojekyll` exists:**
   ```bash
   ls -la .nojekyll  # Linux/Mac
   Get-ChildItem .nojekyll  # Windows
   ```
   If missing, create it: `touch .nojekyll` (empty file)

2. **Check repository is Public:**
   - Settings → General → Danger Zone
   - Change visibility to Public (free tier requirement)

3. **Check build logs:**
   - Settings → Pages → Check "Pages build" section
   - Look for error messages

4. **Verify file structure:**
   - Ensure `index.html` exists in root
   - Check all file paths are correct

#### Changes Not Appearing

**Symptoms:**
- Pushed changes but site still shows old content

**Solutions:**
1. **Wait longer:** GitHub Pages can take 1-5 minutes to update
2. **Clear browser cache:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check deployment status:** Settings → Pages → See build status
4. **Verify files were pushed:** Check repository on GitHub to confirm files are there

#### 404 Errors on Pages

**Symptoms:**
- Homepage works but other pages show 404

**Solutions:**
1. **Check file names:** Ensure exact match (case-sensitive on Linux)
2. **Verify links:** Check navigation links in HTML files
3. **Check file paths:** All paths should be relative (e.g., `about.html` not `/about.html`)

#### JSON Data Not Loading

**Symptoms:**
- Events, results, or documents not displaying

**Solutions:**
1. **Validate JSON syntax:** Use [JSONLint](https://jsonlint.com/)
2. **Check file paths:** Verify paths in `assets/js/main.js` match actual file locations
3. **Check browser console:** F12 → Console tab for error messages
4. **Verify CORS:** GitHub Pages allows CORS, but check for typos in fetch URLs

---

### Vercel Issues

#### Deployment Fails

**Symptoms:**
- Deployment shows "Error" status
- Build logs show errors

**Solutions:**
1. **Check build logs:**
   - Go to Vercel dashboard → Your project → Deployments
   - Click on failed deployment
   - Review build logs for errors

2. **Verify file structure:**
   - Ensure `index.html` exists in root
   - Check all referenced files exist

3. **Check `vercel.json`:**
   - If using custom config, validate JSON syntax
   - Ensure configuration is correct

#### Site Shows Blank Page

**Symptoms:**
- Site loads but shows blank/white page

**Solutions:**
1. **Check browser console:** F12 → Console for JavaScript errors
2. **Verify file paths:** Check that CSS and JS files load correctly
3. **Check Network tab:** F12 → Network → See if files are loading
4. **Verify index.html:** Ensure it's in the root directory

#### Custom Domain Not Working

**Symptoms:**
- Custom domain shows error or doesn't load

**Solutions:**
1. **Check DNS settings:**
   - Verify CNAME or A records are correct
   - Wait for DNS propagation (can take up to 48 hours)

2. **Check Vercel domain settings:**
   - Project Settings → Domains
   - Verify domain is added correctly

3. **Check SSL certificate:**
   - Vercel automatically provisions SSL
   - Wait a few minutes for certificate to be issued

---

### General Issues

#### Images Not Loading

**Solutions:**
1. **Check file paths:** Verify paths in HTML/JSON match actual file locations
2. **Check file names:** Ensure exact match (case-sensitive)
3. **Verify images are committed:** Check that image files are in the repository
4. **Check file size:** Large images may take time to load

#### Contact Form Not Working

**Solutions:**
1. **Verify Formspree form ID:** Check `contact.html` has correct form ID
2. **Test form submission:** Submit test message and check Formspree dashboard
3. **Check Formspree account:** Ensure account is active and not over limit
4. **Verify form action URL:** Check that action URL is correct

#### CSS Not Applying

**Solutions:**
1. **Clear browser cache:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check file path:** Verify CSS file path in HTML `<link>` tag
3. **Check file exists:** Verify `assets/css/main.css` exists
4. **Check for syntax errors:** Validate CSS syntax

---

## Expected URLs Summary

### GitHub Pages

- **Repository URL:** `https://github.com/YOUR_USERNAME/sapf`
- **Live Site URL:** `https://YOUR_USERNAME.github.io/sapf/`
- **Example:** If username is `johndoe`, site is at `https://johndoe.github.io/sapf/`

### Vercel

- **Dashboard URL:** `https://vercel.com/YOUR_USERNAME/sapf`
- **Live Site URL:** `https://sapf.vercel.app` or `https://sapf-YOUR_USERNAME.vercel.app`
- **Inspect URL:** `https://vercel.com/YOUR_USERNAME/sapf/[deployment-id]`

---

## Quick Reference Commands

### GitHub Pages

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sapf.git
git push -u origin main

# Update site
git add .
git commit -m "Update: description"
git push
```

### Vercel CLI

```bash
# Install
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

---

## Support

For deployment issues:
- **GitHub Pages:** Check [GitHub Pages documentation](https://docs.github.com/en/pages)
- **Vercel:** Check [Vercel documentation](https://vercel.com/docs)
- **SAPF Support:** Email info@sapf.co.za

---

**Last Updated:** January 2024
