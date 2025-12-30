# Quick Start Guide

Essential commands and steps to get the SAPF website up and running.

---

## 🚀 Initial Setup

### Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/sapf.git
cd sapf
```

### First-Time Deployment
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sapf.git
git push -u origin main
```

**Enable GitHub Pages:**
1. Go to repository → Settings → Pages
2. Source: Branch `main`, Folder `/ (root)`
3. Save
4. Site live at: `https://YOUR_USERNAME.github.io/sapf/`

---

## 📝 Update JSON Data

### Events (`data/events.json`)
```json
{
  "id": 6,
  "date": "2024-06-15",
  "title": "Event Name",
  "location": "Venue",
  "discipline": "ISSF",
  "entryForm": "documents/entry-forms/form.pdf",
  "results": "results.html#event-6",
  "status": "upcoming"
}
```

### Results (`data/results.json`)
```json
{
  "id": 6,
  "event": "Event Name",
  "date": "2024-02-10",
  "discipline": "ISSF",
  "type": "Air Pistol",
  "pdf": "documents/results/results.pdf",
  "nationalLog": false
}
```

### Documents (`data/documents.json`)
```json
{
  "id": 9,
  "title": "Document Title",
  "category": "Rulebook",
  "discipline": "ISSF",
  "year": 2024,
  "url": "documents/rulebooks/doc.pdf",
  "description": "Description"
}
```

### Gallery (`data/gallery.json`)
```json
{
  "id": 7,
  "src": "assets/images/gallery/image.jpg",
  "alt": "Image description",
  "title": "Image Title"
}
```

**Validate JSON:** Use [JSONLint](https://jsonlint.com/) before committing.

---

## 📄 Add PDFs

1. **Place PDF in directory:**
   ```
   documents/rulebooks/your-file.pdf
   documents/entry-forms/your-file.pdf
   documents/results/your-file.pdf
   ```

2. **Update JSON** with correct path in `url` or `entryForm` field

---

## 🖼️ Add Images

1. **Optimize image** (800-1200px width, <500KB)
2. **Place in:** `assets/images/gallery/your-image.jpg`
3. **Update:** `data/gallery.json` with `src`, `alt`, `title`

---

## 🔄 Push Changes

```bash
git add .
git commit -m "Update: description of changes"
git push
```

**Wait 1-2 minutes** for GitHub Pages to rebuild.

---

## ✅ Verify

- Visit: `https://YOUR_USERNAME.github.io/sapf/`
- Check all pages load
- Test navigation
- Verify JSON data displays
- Test contact form

---

## 🔧 Quick Fixes

**Update canonical URLs:**
```bash
# PowerShell
Get-ChildItem -Filter "*.html" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'yourusername', 'YOUR_USERNAME' | Set-Content $_.FullName
}
```

**Check .nojekyll exists:**
```bash
# Windows
Get-ChildItem .nojekyll

# Linux/Mac
ls -la .nojekyll
```

---

## 📞 Need Help?

- Full guide: See `README.md` and `DEPLOYMENT.md`
- Contact: info@sapf.co.za

---

**Last Updated:** January 2024
