# South African Pistol Federation Website

A modern, fully responsive static website for the South African Pistol Federation (SAPF), built with vanilla HTML, CSS, and JavaScript. Designed for easy deployment to GitHub Pages with no backend required.

## 📋 Project Overview

This is a static website that provides information about SAPF, including:
- Event calendar and competition information
- Competition results and national logs
- Document library (rulebooks, entry forms, results)
- Photo gallery
- Contact form integration
- Information about ISSF and NPA/PPC disciplines

**Technology Stack:**
- Pure HTML5, CSS3, and vanilla JavaScript
- JSON files for dynamic content
- Formspree for contact form handling
- GitHub Pages for hosting

## 📁 File Structure

```
SAPF/
├── index.html              # Homepage with hero and dynamic content
├── about.html              # About SAPF page
├── disciplines.html        # ISSF and NPA/PPC disciplines
├── events.html             # Events calendar (dynamic)
├── results.html            # Results and national logs (dynamic)
├── documents.html          # Document library (dynamic)
├── gallery.html            # Photo gallery (dynamic)
├── contact.html            # Contact form and FAQ
├── terms.html              # Terms of Use
├── privacy.html            # Privacy Policy
├── .nojekyll               # GitHub Pages configuration
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── data/                   # JSON data files
│   ├── events.json         # Event data
│   ├── results.json        # Results and national logs
│   ├── documents.json      # Document metadata
│   └── gallery.json        # Gallery image metadata
└── assets/
    ├── css/
    │   └── main.css        # Main stylesheet
    ├── js/
    │   └── main.js         # JavaScript functionality
    └── images/
        └── gallery/        # Gallery image files
```

## 📝 Updating JSON Data

All dynamic content is stored in JSON files within the `data/` directory. Edit these files to update the website content.

### Events (`data/events.json`)

Add or update events in the `events` array:

```json
{
  "id": 6,
  "date": "2024-06-15",
  "title": "Event Name",
  "location": "Venue Name",
  "discipline": "ISSF",
  "entryForm": "documents/entry-forms/event-form.pdf",
  "results": "results.html#event-6",
  "status": "upcoming"
}
```

**Fields:**
- `id`: Unique number (increment from highest existing ID)
- `date`: Format `YYYY-MM-DD`
- `title`: Event name
- `location`: Venue name
- `discipline`: `"ISSF"` or `"NPA/PPC"`
- `entryForm`: Path to PDF file or `null`
- `results`: Link to results page or `null`
- `status`: `"upcoming"` or `"completed"`

### Results (`data/results.json`)

Add competition results or national logs:

```json
{
  "id": 6,
  "event": "Event Name",
  "date": "2024-02-10",
  "discipline": "ISSF",
  "type": "Air Pistol",
  "pdf": "documents/results/result-file.pdf",
  "nationalLog": false
}
```

**Fields:**
- `id`: Unique number
- `event`: Event name
- `date`: Format `YYYY-MM-DD`
- `discipline`: `"ISSF"` or `"NPA/PPC"`
- `type`: Category name (e.g., "Air Pistol", "Rapid Fire") or `"National Log"`
- `pdf`: Path to results PDF file
- `nationalLog`: `true` for national logs, `false` for competition results

### Documents (`data/documents.json`)

Add document metadata:

```json
{
  "id": 9,
  "title": "Document Title",
  "category": "Rulebook",
  "discipline": "ISSF",
  "year": 2024,
  "url": "documents/rulebooks/document.pdf",
  "description": "Brief description of the document"
}
```

**Fields:**
- `id`: Unique number
- `title`: Document title
- `category`: `"Rulebook"`, `"Entry Form"`, `"Results"`, or `"Logs"`
- `discipline`: `"ISSF"`, `"NPA/PPC"`, or `"General"`
- `year`: Year number
- `url`: Path to PDF file
- `description`: Brief description

### Gallery (`data/gallery.json`)

Add gallery images:

```json
{
  "id": 7,
  "src": "assets/images/gallery/image-name.jpg",
  "alt": "Descriptive alt text for accessibility",
  "title": "Image Title"
}
```

**Fields:**
- `id`: Unique number
- `src`: Path to image file (relative to site root)
- `alt`: Alt text for accessibility (required)
- `title`: Display title (optional)

**Important:** Always validate JSON syntax using a tool like [JSONLint](https://jsonlint.com/) before committing changes.

## 📄 Adding PDF Documents

1. **Create directory structure** (if it doesn't exist):
   ```
   documents/
   ├── rulebooks/
   ├── entry-forms/
   ├── results/
   └── national-logs/
   ```

2. **Upload PDF files** to the appropriate subdirectory

3. **Update JSON files:**
   - Add entry to `data/documents.json` with correct `url` path
   - For events, update `entryForm` field in `data/events.json`
   - For results, update `pdf` field in `data/results.json`

**Path Examples:**
- `documents/rulebooks/issf-rulebook-2024.pdf`
- `documents/entry-forms/2024-national-championships.pdf`
- `documents/results/2024-open-competition-results.pdf`

## 🖼️ Adding Gallery Images

1. **Optimize images:**
   - Recommended size: 800-1200px width
   - Format: JPEG (for photos) or PNG (for graphics)
   - File size: Keep under 500KB for faster loading
   - Use image compression tools if needed

2. **Upload images:**
   - Place image files in `assets/images/gallery/`
   - Use descriptive filenames (e.g., `national-championships-2024.jpg`)

3. **Update `data/gallery.json`:**
   - Add new entry with `id`, `src`, `alt`, and `title` fields
   - Ensure `src` path matches the file location

**Example:**
```json
{
  "id": 7,
  "src": "assets/images/gallery/national-championships-2024.jpg",
  "alt": "Competitors at the 2024 National Championships",
  "title": "National Championships 2024"
}
```

## 🚀 Deploying to GitHub Pages

### Initial Setup

1. **Create GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SAPF website"
   git branch -M main
   git remote add origin https://github.com/yourusername/sapf.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository **Settings** → **Pages**
   - Under **Source**, select:
     - Branch: `main`
     - Folder: `/ (root)`
   - Click **Save**
   - Your site will be live at: `https://yourusername.github.io/sapf/`

3. **Update Canonical URLs:**
   - Edit all HTML files
   - Replace `https://yourusername.github.io/sapf/` with your actual URL
   - Or use find/replace: `yourusername` → `your-actual-username`

### Updating the Site

1. **Make changes** to HTML, CSS, JS, or JSON files
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```
3. **Wait 1-2 minutes** for GitHub Pages to rebuild
4. **Clear browser cache** if changes don't appear

### Important Notes

- The `.nojekyll` file is required for GitHub Pages to serve the site correctly
- Ensure all file paths use forward slashes (`/`) and are case-sensitive
- Test locally before pushing to avoid broken links

## 🧪 Browser Testing Guidelines

### Required Testing

Test the website in the following browsers and devices:

**Desktop Browsers:**
- ✅ Chrome (latest version)
- ✅ Firefox (latest version)
- ✅ Safari (latest version)
- ✅ Microsoft Edge (latest version)

**Mobile Devices:**
- ✅ iOS Safari (iPhone and iPad)
- ✅ Chrome Mobile (Android)
- ✅ Samsung Internet (Android)

### Testing Checklist

**Functionality:**
- [ ] All navigation links work correctly
- [ ] Contact form submits successfully
- [ ] JSON data loads and displays properly
- [ ] PDF links open correctly
- [ ] Gallery lightbox functions properly
- [ ] Filters and sorting work on events, results, and documents pages
- [ ] FAQ accordion expands/collapses correctly

**Responsive Design:**
- [ ] Site displays correctly on mobile (320px+ width)
- [ ] Site displays correctly on tablet (768px+ width)
- [ ] Site displays correctly on desktop (1024px+ width)
- [ ] Navigation menu works on mobile
- [ ] Images scale appropriately
- [ ] Tables are scrollable on mobile

**Accessibility:**
- [ ] Keyboard navigation works (Tab, Enter, Space, Arrow keys)
- [ ] Screen reader compatibility (test with NVDA/JAWS or VoiceOver)
- [ ] Focus indicators are visible
- [ ] Alt text is present on all images
- [ ] Form validation messages are accessible

**Performance:**
- [ ] Page loads in under 3 seconds on 3G connection
- [ ] Images lazy-load correctly
- [ ] No console errors
- [ ] No broken links (use link checker tool)

### Testing Tools

- **Browser DevTools:** Chrome/Firefox DevTools for responsive testing
- **Link Checker:** [W3C Link Checker](https://validator.w3.org/checklink)
- **JSON Validator:** [JSONLint](https://jsonlint.com/)
- **Accessibility:** Browser extensions (WAVE, axe DevTools)
- **Mobile Testing:** Browser DevTools device emulation or physical devices

### Common Issues to Check

- **JSON Syntax Errors:** Validate all JSON files before deployment
- **Case-Sensitive Paths:** Ensure file paths match exactly (especially on Linux servers)
- **Missing Images:** Verify all image paths in `gallery.json` are correct
- **Form Submission:** Test contact form with actual Formspree form ID
- **PDF Links:** Verify all PDF files exist and paths are correct

## ⚙️ Configuration

### Contact Form Setup

1. **Sign up at [Formspree](https://formspree.io)** (free tier available)
2. **Create a new form** and copy your form ID
3. **Update `contact.html`:**
   - Find: `action="https://formspree.io/f/FORM_ID"`
   - Replace `FORM_ID` with your actual Formspree form ID

### Customization

**Colors:** Edit CSS variables in `assets/css/main.css`:
```css
:root {
  --sapf-primary: #1a237e;    /* Main blue */
  --sapf-secondary: #d32f2f;    /* Red accent */
  --sapf-gold: #ffb300;       /* Gold accent */
}
```

**Logo:** Add logo image to `assets/images/` and update header HTML in each page.

## 📞 Support

For questions or issues:
- **Email:** info@sapf.co.za
- **Website:** Visit the contact page for more information

## 📄 License

This website template is provided for use by the South African Pistol Federation.

---

**Last Updated:** January 2024
