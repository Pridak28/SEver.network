# 🔧 GitHub Submission Workflow - Correct Method

## ⚠️ "Uploads are disabled" Error?

This is **normal**! You can't upload directly through the GitHub web interface to someone else's repository.

Here are the **correct methods** to submit your logo:

---

## 🎯 Method 1: GitHub Web Interface (Easiest)

This is the recommended method for beginners.

### Step 1: Fork the Repository

1. Go to: https://github.com/trustwallet/assets
2. Click **"Fork"** button (top right)
3. Wait for fork to complete
4. You now have: `https://github.com/YOUR-USERNAME/assets`

### Step 2: Navigate in YOUR Fork

1. **In your forked repository**, go to:
   ```
   blockchains/polygon/assets/
   ```

2. You should see a list of folders with contract addresses

### Step 3: Create Your Token Folder

1. Click **"Add file"** → **"Create new file"**

2. In the filename box, type:
   ```
   0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1/info.json
   ```

   ⚠️ **Important**: The slash (/) creates the folder automatically!

3. Paste the contents of your `info.json` file:
   ```json
   {
     "name": "Sever.network",
     "type": "POLYGON",
     "symbol": "SEVER",
     "decimals": 18,
     "website": "https://sever.network",
     "description": "Sever.network (SEVER) is a decentralized utility token built on the Polygon blockchain",
     "explorer": "https://polygonscan.com/token/0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1",
     "status": "active",
     "id": "0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1",
     "links": [
       {
         "name": "twitter",
         "url": "https://x.com/severnetwork"
       },
       {
         "name": "telegram",
         "url": "https://t.me/severnetwork"
       },
       {
         "name": "github",
         "url": "https://github.com/SeverNetwork"
       }
     ],
     "tags": [
       "defi",
       "polygon",
       "utility"
     ]
   }
   ```

4. Scroll down and click **"Commit new file"**

### Step 4: Upload Logo

1. Navigate to: `blockchains/polygon/assets/0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1/`

2. Click **"Add file"** → **"Upload files"**

3. Drag and drop your `logo.png` file

4. Click **"Commit changes"**

### Step 5: Create Pull Request

1. Go to your fork's main page: `https://github.com/YOUR-USERNAME/assets`

2. You'll see a banner: **"This branch is 1 commit ahead of trustwallet:master"**

3. Click **"Contribute"** → **"Open pull request"**

4. Fill in the details:
   - **Title**: `Add Sever.network (SEVER) - Polygon`
   - **Description**: See template below

5. Click **"Create pull request"**

---

## 🎯 Method 2: Git Command Line (Advanced)

For users comfortable with terminal/command line.

### Step 1: Fork on GitHub

1. Go to: https://github.com/trustwallet/assets
2. Click **"Fork"**

### Step 2: Clone Your Fork

```bash
# Replace YOUR-USERNAME with your GitHub username
git clone https://github.com/YOUR-USERNAME/assets.git
cd assets
```

### Step 3: Create Branch

```bash
# Create a new branch for your changes
git checkout -b add-sever-token
```

### Step 4: Create Folder & Add Files

```bash
# Navigate to Polygon assets
cd blockchains/polygon/assets/

# Create your token folder
mkdir 0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1
cd 0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1

# Copy your files here
cp ~/Desktop/"1245wew copy"/trust-wallet-submission/logo.png .
cp ~/Desktop/"1245wew copy"/trust-wallet-submission/info.json .
```

### Step 5: Commit and Push

```bash
# Add files
git add logo.png info.json

# Commit
git commit -m "Add Sever.network (SEVER) token on Polygon"

# Push to your fork
git push origin add-sever-token
```

### Step 6: Create Pull Request

1. Go to: `https://github.com/YOUR-USERNAME/assets`
2. GitHub will show a banner to create PR
3. Click **"Compare & pull request"**
4. Fill in details and submit

---

## 🎯 Method 3: GitHub Desktop (User-Friendly)

For those who prefer a GUI instead of command line.

### Step 1: Install GitHub Desktop

Download from: https://desktop.github.com/

### Step 2: Fork & Clone

1. Fork repository on GitHub
2. In GitHub Desktop: **File** → **Clone Repository**
3. Select your forked `assets` repository
4. Choose a local path

### Step 3: Create Branch

1. In GitHub Desktop: **Branch** → **New Branch**
2. Name: `add-sever-token`
3. Click **Create Branch**

### Step 4: Add Files

1. Open the repository folder in Finder/Explorer
2. Navigate to: `blockchains/polygon/assets/`
3. Create folder: `0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1`
4. Copy `logo.png` and `info.json` into this folder

### Step 5: Commit & Push

1. GitHub Desktop will show your changes
2. Add commit message: "Add Sever.network (SEVER) token"
3. Click **"Commit to add-sever-token"**
4. Click **"Push origin"**

### Step 6: Create Pull Request

1. In GitHub Desktop, click **"Create Pull Request"**
2. Browser opens with PR form
3. Fill in details and submit

---

## 📝 Pull Request Template

Use this template when creating your PR:

```markdown
## Token Information
- **Name**: Sever.network
- **Symbol**: SEVER
- **Type**: POLYGON
- **Decimals**: 18
- **Contract**: 0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1

## Links
- **Website**: https://sever.network
- **Twitter**: https://x.com/severnetwork
- **Telegram**: https://t.me/severnetwork
- **Explorer**: https://polygonscan.com/token/0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1
- **Trading**: https://quickswap.exchange/#/swap?outputCurrency=0x7C58441f45E95EA5A1E40B51B1f89799d405a1B1

## Verification
- [x] Logo is 256x256 PNG
- [x] File size under 100KB
- [x] info.json is valid JSON
- [x] Contract address is checksum format
- [x] Token is deployed and verified on PolygonScan
- [x] Project has active website and social media

## Additional Info
SEVER is a utility token on Polygon network with active community on Twitter and Telegram.
```

---

## ✅ Checklist - Before You Start

- [ ] Have a GitHub account (create at https://github.com/join)
- [ ] Converted logo.svg to logo.png (256x256)
- [ ] Verified logo.png is under 100KB
- [ ] Verified contract address is in checksum format
- [ ] Chosen your preferred method (Web/CLI/Desktop)

---

## 🐛 Troubleshooting

### "Uploads are disabled"
**Solution**: You're trying to upload to the original repository. Make sure you're in **your fork** (check the URL shows YOUR username).

### "File path too long"
**Solution**: Use Method 1 (Web Interface) with the filename trick: `0x7C58.../info.json`

### "Can't push to repository"
**Solution**: Make sure you're pushing to your fork, not the original repository.

### "Permission denied"
**Solution**: Check you're logged into GitHub and working in your fork.

---

## 💡 Which Method Should I Use?

### Choose Method 1 (Web Interface) if:
- ✅ You're new to GitHub
- ✅ You just have 2 files to upload
- ✅ You want the quickest method
- ✅ You don't have Git installed

### Choose Method 2 (Command Line) if:
- ✅ You're comfortable with terminal
- ✅ You use Git regularly
- ✅ You want full control
- ✅ You might submit updates later

### Choose Method 3 (GitHub Desktop) if:
- ✅ You want a GUI but more control than web
- ✅ You're not comfortable with command line
- ✅ You want to learn Git workflow
- ✅ You manage multiple repositories

---

## ⏱️ Time Estimates

| Method | Setup Time | Submission Time | Difficulty |
|--------|------------|-----------------|------------|
| Web Interface | 0 min | 10 min | ⭐ Easy |
| Command Line | 5 min | 5 min | ⭐⭐⭐ Hard |
| GitHub Desktop | 10 min | 7 min | ⭐⭐ Medium |

**Recommendation for first-time users**: Method 1 (Web Interface)

---

## 🎯 Common Mistakes to Avoid

❌ **Trying to upload to trustwallet/assets directly**
✅ Upload to YOUR-USERNAME/assets (your fork)

❌ **Wrong folder path**
✅ Must be: `blockchains/polygon/assets/0x7C5.../`

❌ **Lowercase address**
✅ Must use checksum format (mixed case)

❌ **Logo wrong size**
✅ Must be exactly 256x256 pixels

❌ **Multiple pull requests**
✅ Create only ONE pull request

---

## 📞 Need Help?

### GitHub Help
- First time with GitHub? https://docs.github.com/en/get-started
- Pull requests: https://docs.github.com/en/pull-requests

### Trust Wallet Help
- Asset guidelines: https://github.com/trustwallet/assets/blob/master/.github/CONTRIBUTING.md
- Issues: https://github.com/trustwallet/assets/issues

---

## 🎉 After Submission

Once you've created the Pull Request:

1. **Wait patiently** (3-7 days)
2. **Check for comments** from reviewers
3. **Respond quickly** if changes requested
4. **Celebrate** when it's merged! 🎊

Then wait 24-48 hours for your logo to appear in MetaMask!

---

**Ready? Pick your method and let's get started! 🚀**

*Updated: November 2024*
*For issues with this guide, check SUBMISSION-GUIDE.md*