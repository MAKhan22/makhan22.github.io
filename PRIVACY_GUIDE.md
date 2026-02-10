# Privacy & AI Training Prevention Guide

## 🔒 Protecting Your Sensitive Information

Since you'll be adding personal information (research, awards, scholarships, etc.) to this portfolio, here's how to ensure this data isn't used to train AI models.

---

## For Cursor IDE (Current Environment)

### Option 1: Disable Privacy Mode (Recommended)
1. Open **Cursor Settings** (Cmd/Ctrl + ,)
2. Search for: **"privacy"**
3. Look for **"Cursor: Privacy Mode"** or **"Cursor: Enable Telemetry"**
4. **Enable Privacy Mode** or **Disable Telemetry**
5. Restart Cursor

### Option 2: Add to .gitignore (Partial Solution)
While editing locally, you can add sensitive files to `.gitignore`:
```bash
# Add to .gitignore
src/data/profile.json
src/data/awards.json
src/data/publications.json
```

**Note**: This prevents Git from tracking them, but Cursor might still see them.

### Option 3: Use Cursor's Opt-Out
1. Open Cursor Settings
2. Search for: **"terms"** or **"data collection"**
3. Look for opt-out options for:
   - Code indexing
   - Telemetry
   - AI training data

---

## For GitHub (Once Deployed)

### robots.txt File
Already included in your project! Add this to `public/robots.txt`:

```txt
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Google-Extended
Disallow: /
```

✅ **Created!** `public/robots.txt` - Blocks major AI crawlers

### Add Meta Tags (Optional)
You can also add meta tags to `index.html`:
```html
<meta name="robots" content="noai, noimageai">
<meta name="googlebot" content="noai">
```

---

## For Your Local Files

### Cursor Specific Settings

**To check your current Cursor privacy settings:**

1. **Open Cursor Settings**: `Cmd + ,` (Mac) or `Ctrl + ,` (Windows/Linux)
2. **Search for these settings**:
   - `privacy mode`
   - `telemetry`
   - `indexing`
   - `training`

3. **Recommended Settings**:
   ```
   ☑ Cursor: Privacy Mode (ENABLE)
   ☐ Cursor: Enable Telemetry (DISABLE)
   ☐ Cursor: Enable Indexing (DISABLE if you want)
   ```

### Alternative: Settings JSON
You can also edit your Cursor settings JSON directly:

1. Open Command Palette: `Cmd/Ctrl + Shift + P`
2. Type: **"Preferences: Open User Settings (JSON)"**
3. Add these settings:
```json
{
  "cursor.privacyMode": true,
  "telemetry.telemetryLevel": "off",
  "cursor.indexing.enabled": false
}
```

---

## Important Notes

### What robots.txt Does:
✅ Blocks **well-behaved** AI crawlers
✅ Prevents **major companies** (OpenAI, Anthropic, Google) from scraping
✅ Standard web practice

### What robots.txt DOESN'T Do:
❌ Doesn't prevent manual copying
❌ Some bad actors may ignore it
❌ Doesn't retroactively remove already-scraped data

### Best Practices

1. **robots.txt**: ✅ Already added to your project
2. **Cursor Privacy Mode**: ⚠️ Check your settings (instructions above)
3. **Don't put ultra-sensitive data**: Like SSN, passwords, API keys (never!)
4. **Public portfolio = public info**: Assume anything online can be seen
5. **Use professional email**: Don't use personal/private email for public portfolio

---

## Recommended Privacy Settings

### Low Risk Information (OK to share):
- ✅ Name, professional title
- ✅ University/company names (public info)
- ✅ Project descriptions
- ✅ Published research papers
- ✅ Public awards/scholarships
- ✅ Professional email
- ✅ LinkedIn/GitHub links

### Higher Risk Information (Be cautious):
- ⚠️ Unpublished research details
- ⚠️ Grant amounts (specific numbers)
- ⚠️ Personal contact info
- ⚠️ Internal project details
- ⚠️ Proprietary work

### Never Share:
- ❌ Social Security Number
- ❌ Passport/ID numbers
- ❌ Personal phone number
- ❌ Home address
- ❌ Financial account details
- ❌ API keys or passwords

---

## For This Project Specifically

Your portfolio will contain:
1. ✅ **Profile data** - Name, bio, links (safe)
2. ✅ **Projects** - Public GitHub repos (already public)
3. ✅ **Experience** - Work history (LinkedIn-level info)
4. ⚠️ **Publications** - Keep abstracts brief, link to papers
5. ⚠️ **Awards/Grants** - You can omit specific amounts if concerned
6. ✅ **Workshops** - Safe to share
7. ✅ **Certificates** - Public course completions

**Recommendation**: Treat this portfolio like your LinkedIn profile - professional, public info only.

---

## Quick Privacy Checklist

Before deploying:
- [ ] Enable Cursor Privacy Mode
- [ ] Verify `robots.txt` is in `public/` folder
- [ ] Review all JSON files - remove anything too personal
- [ ] Use professional email (not personal)
- [ ] Don't include financial details (optional)
- [ ] Check that links are correct and public

---

## Summary

**For Cursor/Local Development:**
- ✅ Enable Privacy Mode in Cursor Settings
- ✅ Disable Telemetry
- ✅ Your data stays local while editing

**For Deployed Website:**
- ✅ `robots.txt` blocks AI crawlers (already added)
- ✅ Only share LinkedIn-level professional info
- ✅ Don't put anything you wouldn't put on LinkedIn

**Reality Check:**
- Your portfolio is **public by design** - recruiters need to see it
- Focus on blocking **automated AI training**, not legitimate visitors
- The `robots.txt` file helps a lot with major AI companies

---

Need help with Cursor settings? Type `Cmd/Ctrl + Shift + P` and search for "settings" to explore options.

