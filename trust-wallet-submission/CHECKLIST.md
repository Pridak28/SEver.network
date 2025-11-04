# ✅ Trust Wallet Submission Checklist

## Before You Start

- [ ] Have a GitHub account
- [ ] Logo is ready (SVG provided)
- [ ] Know your contract address: `0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1`

---

## Step 1: Prepare Files

- [ ] Convert `logo.svg` to `logo.png` (256x256 pixels)
  - Option A: Use https://svgtopng.com
  - Option B: Run `./convert-logo.sh` (if ImageMagick installed)
  - Option C: Use Inkscape or Photoshop

- [ ] Verify `logo.png`:
  - [ ] Exactly 256x256 pixels
  - [ ] PNG format
  - [ ] Under 100KB
  - [ ] Clear and centered

- [ ] Verify `info.json`:
  - [ ] Contract address is correct
  - [ ] All links work
  - [ ] Valid JSON format

---

## Step 2: GitHub Setup

- [ ] Go to https://github.com/trustwallet/assets
- [ ] Click "Fork" button (top right)
- [ ] Wait for fork to complete
- [ ] Navigate to `blockchains/polygon/assets/`

---

## Step 3: Get Checksum Address

**VERY IMPORTANT**: Address must be in checksum format (mixed case)!

- [ ] Go to https://web3-tools.com/address-checksum
- [ ] Paste: `0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1`
- [ ] Copy the checksum result
- [ ] Should be: `0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1` ✅

---

## Step 4: Upload Files

- [ ] In your fork, go to `blockchains/polygon/assets/`
- [ ] Click "Create new file"
- [ ] Create folder: `0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1/`
- [ ] Upload `logo.png`
- [ ] Upload `info.json`
- [ ] Commit changes

---

## Step 5: Create Pull Request

- [ ] Go to your fork's main page
- [ ] Click "Contribute" → "Open pull request"
- [ ] Fill title: `Add Sever.network (SEVER) - Polygon`
- [ ] Add description (see SUBMISSION-GUIDE.md)
- [ ] Submit PR
- [ ] Note down PR number

---

## Step 6: Wait for Review

- [ ] Monitor PR for comments
- [ ] Respond to any requests quickly
- [ ] Be patient (3-7 days typical)

---

## Step 7: After Approval

- [ ] PR is merged ✅
- [ ] Wait 24-48 hours for CDN update
- [ ] Test in MetaMask
- [ ] Test in Trust Wallet
- [ ] Logo appears! 🎉

---

## Quick Reference

### Important Links
- Trust Wallet Assets: https://github.com/trustwallet/assets
- Checksum Tool: https://web3-tools.com/address-checksum
- SVG to PNG: https://svgtopng.com
- JSON Validator: https://jsonlint.com
- Image Optimizer: https://tinypng.com

### Your Token Details
```
Name: Sever.network
Symbol: SEVER
Contract: 0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1
Network: Polygon
Decimals: 18
```

### File Structure
```
blockchains/polygon/assets/0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1/
├── logo.png (256x256, <100KB)
└── info.json (token metadata)
```

---

## Common Issues

### ❌ "Invalid checksum address"
**Fix**: Use https://web3-tools.com/address-checksum

### ❌ "File too large"
**Fix**: Optimize at https://tinypng.com

### ❌ "Invalid JSON"
**Fix**: Validate at https://jsonlint.com

### ❌ "Logo not showing"
**Fix**: Wait 48 hours after merge, clear cache

---

## Estimated Timeline

| Step | Time |
|------|------|
| File preparation | 10-15 min |
| GitHub fork/upload | 5-10 min |
| PR submission | 5 min |
| Initial review | 1-3 days |
| Approval & merge | 3-7 days |
| CDN update | 24-48 hours |
| **Total** | **~5-12 days** |

---

**✨ You've got this! Follow each step carefully and your logo will be live soon!**