# 🎯 SEVER Token - Trust Wallet & MetaMask Logo Submission Guide

## 📋 Overview

This guide will help you submit your SEVER token logo to Trust Wallet's asset repository, which will automatically make it appear in MetaMask and other wallets.

---

## 📦 Files Prepared

All files are ready in the `trust-wallet-submission/` folder:

- ✅ `logo.svg` - High-quality 256x256 token logo
- ✅ `info.json` - Token metadata file
- ✅ This guide

---

## 🎨 Step 1: Convert SVG to PNG

You need to convert the logo.svg to logo.png (256x256 pixels).

### Option A: Online Converter (Easiest)
1. Go to https://svgtopng.com or https://cloudconvert.com/svg-to-png
2. Upload `logo.svg`
3. Set dimensions: **256x256 pixels**
4. Download as `logo.png`
5. Verify file size is under 100KB

### Option B: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
brew install imagemagick  # macOS
# or
sudo apt-get install imagemagick  # Linux

# Convert
cd trust-wallet-submission
convert logo.svg -resize 256x256 logo.png
```

### Option C: Using Inkscape
1. Open `logo.svg` in Inkscape
2. File → Export PNG Image
3. Set width/height to 256px
4. Export as `logo.png`

---

## 🔧 Step 2: Verify Your Files

Before submitting, check:

- [ ] `logo.png` is exactly 256x256 pixels
- [ ] File size is under 100KB
- [ ] Background is transparent or solid color
- [ ] Image is clear and centered
- [ ] `info.json` has correct contract address

---

## 🚀 Step 3: Submit to Trust Wallet Assets

### A. Fork the Repository

1. **Go to Trust Wallet Assets Repository**
   ```
   https://github.com/trustwallet/assets
   ```

2. **Click "Fork" button** (top right)
   - This creates a copy in your GitHub account

3. **Wait for fork to complete**

### B. Navigate to Polygon Assets

1. In your forked repository, navigate to:
   ```
   blockchains/polygon/assets/
   ```

2. Look at the folder structure - each token has a folder named with its contract address

### C. Create Your Token Folder

1. **Get checksum address** (very important!)
   - Your contract: `0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1`
   - Verify checksum at: https://etherscan.io/checksumtool
   - OR use: https://web3-tools.com/address-checksum

2. **Create new folder** in `blockchains/polygon/assets/`:
   ```
   0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1
   ```

   ⚠️ **IMPORTANT**: The address MUST be in checksum format (mixed case)!

### D. Upload Files

1. **Click "Add file" → "Upload files"**

2. **Drag and drop both files**:
   - `logo.png` (256x256 pixels)
   - `info.json`

3. **Commit files directly to your fork**

---

## 📝 Step 4: Create Pull Request

1. **Go to your forked repository main page**

2. **Click "Contribute" → "Open pull request"**

3. **Fill out the PR template**:

   **Title:**
   ```
   Add Sever.network (SEVER) - Polygon
   ```

   **Description:**
   ```
   ## Token Information
   - **Name**: Sever.network
   - **Symbol**: SEVER
   - **Type**: POLYGON
   - **Decimals**: 18
   - **Contract**: 0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1

   ## Links
   - Website: https://sever.network
   - Twitter: https://x.com/severnetwork
   - Telegram: https://t.me/severnetwork
   - Explorer: https://polygonscan.com/token/0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1

   ## Verification
   - [x] Logo is 256x256 PNG
   - [x] File size under 100KB
   - [x] info.json is valid
   - [x] Contract address is checksum format
   - [x] Token is deployed and verified
   ```

4. **Submit the Pull Request**

---

## ⏳ Step 5: Wait for Review

### Timeline
- **Initial review**: 1-3 days
- **Approval**: 3-7 days typically
- **Merge**: Once approved

### What Reviewers Check
- ✅ Logo quality and size
- ✅ Correct checksum address
- ✅ Valid info.json format
- ✅ Token is real and deployed
- ✅ No copyright issues

### If Changes Requested
- Make the changes in your fork
- Commit them
- The PR will auto-update

---

## 🎉 Step 6: After Approval

Once your PR is merged:

1. **Wait 24-48 hours** for CDN update
2. **Logo will appear in**:
   - Trust Wallet
   - MetaMask
   - Other wallet apps
   - DeFi platforms
   - Token trackers

---

## 🔍 Alternative: QuickSwap Logo Submission

You can also submit to QuickSwap directly:

1. **Go to**: https://github.com/sameepsi/quickswap-default-token-list
2. **Follow similar process** as Trust Wallet
3. **Faster approval** (usually 1-2 days)

---

## 📊 Your Token Info

```json
Contract Address: 0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1
Network: Polygon (MATIC)
Token Name: Sever.network
Symbol: SEVER
Decimals: 18
```

### Verification Links
- **PolygonScan**: https://polygonscan.com/token/0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1
- **QuickSwap**: https://quickswap.exchange/#/swap?outputCurrency=0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1

---

## ⚠️ Important Tips

### DO:
✅ Use exact checksum address format
✅ Ensure logo is exactly 256x256px
✅ Keep file size under 100KB
✅ Use transparent or solid background
✅ Follow the folder structure exactly
✅ Be patient with review process

### DON'T:
❌ Use lowercase/uppercase only address
❌ Upload files to wrong folder
❌ Use copyrighted images
❌ Submit duplicate tokens
❌ Make multiple PRs for same token
❌ Argue with reviewers

---

## 🐛 Troubleshooting

### "Invalid checksum address"
- Use: https://web3-tools.com/address-checksum
- Copy the checksum version exactly

### "File too large"
- Optimize PNG: https://tinypng.com
- Reduce to under 100KB

### "Invalid JSON"
- Validate at: https://jsonlint.com
- Check for missing commas/brackets

### "PR rejected"
- Read the rejection reason carefully
- Fix the issues mentioned
- Submit a new PR

---

## 📱 Verify Logo Appears

After approval, verify your logo shows up:

### MetaMask
1. Import token: `0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1`
2. Logo should appear automatically

### Trust Wallet
1. Add custom token
2. Logo should load from their CDN

### QuickSwap
1. Search for SEVER
2. Logo should appear in swap interface

---

## 📞 Need Help?

### Trust Wallet Issues
- GitHub: https://github.com/trustwallet/assets/issues
- Telegram: https://t.me/trust_announcements

### QuickSwap Issues
- Discord: https://discord.gg/dSMd7AFH36
- Telegram: https://t.me/QuickSwapDEX

---

## ✅ Checklist Before Submission

- [ ] Converted logo.svg to logo.png (256x256)
- [ ] Verified file size under 100KB
- [ ] Got checksum format of contract address
- [ ] Created GitHub account
- [ ] Forked Trust Wallet repository
- [ ] Created folder with checksum address
- [ ] Uploaded logo.png and info.json
- [ ] Created Pull Request with description
- [ ] Waited patiently for review

---

## 🎯 Expected Result

**Before**: Token shows as generic icon in wallets
**After**: Your cyan "S" logo appears everywhere!

This increases:
- Professional appearance
- User trust
- Token recognition
- Trading volume

---

**Good luck with your submission! 🚀**

*Last updated: November 2024*