# 🔧 Quick Troubleshooting Guide

## ⚠️ "Uploads are disabled"

**Problem**: You see "Uploads are disabled. File uploads require push access to this repository."

**Solution**: You're trying to upload to the wrong repository!

### ✅ Fix:
1. Make sure you **forked** the repository first
2. Go to **YOUR** fork: `https://github.com/YOUR-USERNAME/assets`
3. Upload files in **your fork**, NOT in `trustwallet/assets`

**Detailed guide**: See [GITHUB-WORKFLOW.md](GITHUB-WORKFLOW.md)

---

## ❌ "Invalid checksum address"

**Problem**: PR rejected because address format is wrong

**Solution**: Use checksum format (mixed case letters)

### ✅ Fix:
1. Go to: https://web3-tools.com/address-checksum
2. Paste: `0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1`
3. Copy the result with exact case
4. Use this in folder name

**Correct**: `0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1` (mixed case)
**Wrong**: `0x7c58441f45e95ea5a1e40b51b1f89799d405a1b1` (all lowercase)

---

## 📏 "File too large"

**Problem**: logo.png is over 100KB

**Solution**: Optimize the image

### ✅ Fix:
1. Go to: https://tinypng.com
2. Upload your `logo.png`
3. Download the optimized version
4. Check file size (should be under 100KB)

**Alternative**: Use lower quality export settings when converting from SVG

---

## 🖼️ "Logo wrong size"

**Problem**: Image is not 256x256 pixels

**Solution**: Resize to exact dimensions

### ✅ Fix:
1. Go to: https://svgtopng.com
2. Upload your SVG
3. Set dimensions to **256 width × 256 height**
4. Download
5. Verify: Right-click → Get Info (Mac) or Properties (Windows)

---

## 📝 "Invalid JSON"

**Problem**: info.json has syntax errors

**Solution**: Validate and fix JSON

### ✅ Fix:
1. Go to: https://jsonlint.com
2. Paste your `info.json` content
3. Click "Validate JSON"
4. Fix any errors shown
5. Copy the corrected version

**Common issues**:
- Missing comma between fields
- Extra comma at the end
- Unclosed brackets or quotes

---

## 🔐 "Permission denied"

**Problem**: Can't push changes to repository

**Solution**: Check authentication

### ✅ Fix:
1. Make sure you're logged into GitHub
2. Verify you're working in **your fork**
3. If using command line, check SSH/HTTPS authentication
4. Try GitHub Desktop instead for easier authentication

---

## 📁 "Can't find folder"

**Problem**: Can't navigate to `blockchains/polygon/assets/`

**Solution**: Correct repository structure

### ✅ Fix:
1. Make sure you're in the **assets** repository
2. Click on folders to navigate:
   - `blockchains/` →
   - `polygon/` →
   - `assets/`
3. You should see many address folders (0x...)

---

## 🚫 "Pull Request already exists"

**Problem**: Can't create another PR

**Solution**: Update existing PR or wait

### ✅ Fix:
1. Find your existing PR
2. Make changes in your fork
3. Changes automatically update the PR
4. OR close old PR and create new one
5. OR wait for review of existing PR

---

## ⏸️ "No response from reviewers"

**Problem**: PR submitted but no response after many days

**Solution**: Be patient, then follow up politely

### ✅ Fix:
1. Wait at least **7 days** before following up
2. Check if there are comments you missed
3. Add a polite comment: "Friendly ping - is there anything I can improve?"
4. Check Trust Wallet's GitHub for any announcements about delays

**Normal timeline**: 3-7 days for initial review

---

## 🔄 "Changes requested"

**Problem**: Reviewer asked for modifications

**Solution**: Make the changes quickly

### ✅ Fix:
1. Read the reviewer's comment carefully
2. Make the requested changes in your fork
3. Commit the changes
4. PR updates automatically
5. Reply to let them know you've made the changes

**Response time**: Try to respond within 24 hours

---

## 🖼️ "Logo not showing after merge"

**Problem**: PR was merged but logo still not in MetaMask

**Solution**: Wait for CDN propagation

### ✅ Fix:
1. Wait **24-48 hours** after merge
2. Clear your MetaMask cache
3. Remove and re-add the token
4. Try on a different device
5. Check if logo URL is accessible

**CDN URL format**:
```
https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1/logo.png
```

---

## 🔍 "Contract not found"

**Problem**: Trust Wallet says contract doesn't exist

**Solution**: Verify deployment

### ✅ Fix:
1. Check contract on PolygonScan:
   https://polygonscan.com/token/0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1
2. Make sure it's verified
3. Ensure contract address is exactly correct
4. Check you're using Polygon network (not Ethereum)

---

## 💻 "GitHub Desktop not working"

**Problem**: GitHub Desktop shows errors

**Solution**: Refresh or reinstall

### ✅ Fix:
1. File → Options → Sign Out
2. Sign back in
3. Repository → Pull to update
4. Try your action again
5. If still broken, use Method 1 (Web Interface) instead

---

## 🌐 "Web interface won't let me create file"

**Problem**: Can't click "Create new file"

**Solution**: Check repository permissions

### ✅ Fix:
1. Verify you're in **your fork** (check URL)
2. Make sure you're logged in
3. Refresh the page
4. Try a different browser
5. Clear browser cache

---

## 📱 "Testing on mobile"

**Problem**: Want to test logo before submission

**Solution**: Can't test until merged

### ✅ Fix:
Unfortunately, you can't test the logo before it's merged. But you can:
1. Preview `logo.png` on your computer
2. Check it's 256x256 pixels
3. Verify it looks good at small size
4. Trust the submission process

After merge, test in MetaMask mobile app.

---

## 🆘 "None of these solutions work"

**Problem**: Still stuck after trying everything

**Solution**: Ask for help

### ✅ Where to ask:
1. **Trust Wallet GitHub Issues**: https://github.com/trustwallet/assets/issues
2. **Include**:
   - Your token contract address
   - Link to your PR (if created)
   - What you tried
   - Screenshots of error
3. **Be polite and patient**

---

## 📚 Additional Resources

### Documentation
- [GITHUB-WORKFLOW.md](GITHUB-WORKFLOW.md) - 3 methods to submit
- [SUBMISSION-GUIDE.md](SUBMISSION-GUIDE.md) - Complete instructions
- [CHECKLIST.md](CHECKLIST.md) - Step-by-step process

### External Tools
- **Checksum Tool**: https://web3-tools.com/address-checksum
- **Image Optimizer**: https://tinypng.com
- **SVG Converter**: https://svgtopng.com
- **JSON Validator**: https://jsonlint.com

### Verification
- **PolygonScan**: https://polygonscan.com/token/0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1
- **GitHub Help**: https://docs.github.com/en

---

## ✅ Prevention Checklist

Avoid problems by checking these **before submission**:

- [ ] Logo is exactly 256×256 pixels
- [ ] File size is under 100KB
- [ ] Address is in checksum format
- [ ] JSON is valid (tested at jsonlint.com)
- [ ] Working in YOUR fork, not original repo
- [ ] Files in correct folder: `blockchains/polygon/assets/0x.../`
- [ ] Contract exists and is verified on PolygonScan

---

**Still need help? Open the appropriate guide file from the list above!**