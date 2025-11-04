const express = require("express");
const cors = require("cors");
const ethers = require("ethers");
const { severToken, initialWallets } = require("./token");
const path = require("path");
const { severNetwork } = require("./index.js");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const USERS_FILE = path.resolve(__dirname, "users.json");

const app = express();
app.use(cors());
app.use(express.json());
// Serve static frontend files from the workspace root
app.use(express.static(path.resolve(__dirname, "..")));

// Fallback routes to serve frontend.html directly
app.get(["/", "/frontend.html"], (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "frontend.html"));
});

// Token metadata endpoint
app.get("/token/info", (req, res) => {
  res.json({
    name: severToken.name,
    symbol: severToken.symbol,
    totalSupply: severToken.totalSupply,
  });
});

// Balance lookup
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = severToken.balanceOf(address);
  res.json({ address, balance });
});

// Transfer endpoint expects MetaMask-signed payload
app.post("/transfer", async (req, res) => {
  try {
    const { fromAddress, toAddress, amount, signature } = req.body;
    if (!fromAddress || !toAddress || !amount || !signature) {
      return res.status(400).json({ error: "Missing parameters" });
    }
    // Construct the message hash the same way MetaMask signs it
    const encoded = ethers.utils.defaultAbiCoder.encode(
      ["address", "address", "uint256"],
      [fromAddress, toAddress, amount]
    );
    const messageHash = ethers.utils.keccak256(encoded);
    const recovered = ethers.utils.recoverAddress(messageHash, signature);
    if (recovered.toLowerCase() !== fromAddress.toLowerCase()) {
      return res.status(400).json({ error: "Invalid signature" });
    }
    const success = severToken.transfer(fromAddress, toAddress, Number(amount));
    if (!success) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    res.json({ success, fromAddress, toAddress, amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Blockchain Explorer API
// List all blocks (summary)
app.get("/explorer/blocks", (req, res) => {
  const blocks = severNetwork.chain.map((b) => ({
    index: b.index,
    hash: b.hash,
    previousHash: b.previousHash,
    timestamp: b.timestamp,
    txCount: Array.isArray(b.data) ? b.data.length : 0,
  }));
  res.json(blocks);
});

// Get block by index or hash
app.get("/explorer/block/:id", (req, res) => {
  const { id } = req.params;
  const block = severNetwork.chain.find((b) => b.index == id || b.hash === id);
  if (!block) return res.status(404).json({ error: "Block not found" });
  res.json(block);
});

// List all transactions (flattened)
app.get("/explorer/transactions", (req, res) => {
  const txs = severNetwork.chain
    .flatMap((b) => (Array.isArray(b.data) ? b.data : []))
    .map((tx, idx) => ({
      ...tx,
      blockIndex: severNetwork.chain.find(
        (b) => Array.isArray(b.data) && b.data.includes(tx)
      )?.index,
    }));
  res.json(txs);
});

// Get all transactions for an address
app.get("/explorer/address/:address", (req, res) => {
  const { address } = req.params;
  const txs = severNetwork.chain
    .flatMap((b) => (Array.isArray(b.data) ? b.data : []))
    .filter((tx) => tx.fromAddress === address || tx.toAddress === address);
  res.json(txs);
});

// Track claimed invitation codes
const claimedCodes = new Set();
// Generate invitation codes for each wallet (simple example: code = first 8 chars of address)
const invitationCodes = {};
initialWallets.forEach((w) => {
  const code = w.address.slice(0, 8);
  invitationCodes[code] = w;
});

console.log("Valid invitation codes (first 8 chars of each wallet address):");
Object.entries(invitationCodes).forEach(([code, wallet]) => {
  console.log(`Code: ${code}  Address: ${wallet.address}`);
});

// Write all valid invitation codes to invitation_codes.txt on server start
const INVITATION_CODES_FILE = path.resolve(
  __dirname,
  "../invitation_codes.txt"
);
const invitationCodesText = Object.entries(invitationCodes)
  .map(([code, wallet]) => `Code: ${code}  Address: ${wallet.address}`)
  .join("\n");
fs.writeFileSync(INVITATION_CODES_FILE, invitationCodesText);

// Endpoint to claim a wallet with invitation code
app.post("/claim", (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing invitation code" });
  if (claimedCodes.has(code))
    return res.status(400).json({ error: "Code already claimed" });
  const wallet = invitationCodes[code];
  if (!wallet)
    return res.status(400).json({ error: "Invalid invitation code" });
  claimedCodes.add(code);
  res.json({
    address: wallet.address,
    privateKey: wallet.key.getPrivate("hex"),
    balance: severToken.balanceOf(wallet.address),
  });
});

// Endpoint to retrieve the 15 generated wallets with private keys and balances
app.get("/wallets", (req, res) => {
  const wallets = initialWallets.map((w) => ({
    address: w.address,
    privateKey: w.key.getPrivate("hex"),
    balance: severToken.balanceOf(w.address),
  }));
  res.json(wallets);
});

function ensureUsersFile() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
  }
}

function loadUsers() {
  ensureUsersFile();
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}
function saveUsers(users) {
  ensureUsersFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

// Register endpoint (username, password, invitation code optional)
app.post("/register", async (req, res) => {
  const { username, password, code } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });
  const users = loadUsers();
  if (users.find((u) => u.username === username))
    return res.status(400).json({ error: "Username already exists" });
  let address = null,
    privateKey = null,
    balance = 0;
  if (code) {
    if (claimedCodes.has(code))
      return res.status(400).json({ error: "Invitation code already claimed" });
    const wallet = invitationCodes[code];
    if (!wallet)
      return res.status(400).json({ error: "Invalid invitation code" });
    claimedCodes.add(code);
    address = wallet.address;
    privateKey = wallet.key.getPrivate("hex");
    balance = severToken.balanceOf(wallet.address);
  } else {
    // Always generate a wallet for new users without invitation code
    const key = ec.genKeyPair();
    address = key.getPublic("hex");
    privateKey = key.getPrivate("hex");
    balance = 0; // No tokens unless invitation code is used
  }
  const hash = await bcrypt.hash(password, 10);
  const user = {
    username,
    passwordHash: hash,
    address,
    privateKey,
    code: code || null,
  };
  users.push(user);
  saveUsers(users);
  res.json({
    username,
    address,
    privateKey,
    balance,
  });
});

// Login endpoint (username, password)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });
  const users = loadUsers();
  const user = users.find((u) => u.username === username);
  if (!user)
    return res.status(400).json({ error: "Invalid username or password" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid)
    return res.status(400).json({ error: "Invalid username or password" });
  res.json({
    username,
    address: user.address,
    privateKey: user.privateKey,
    balance: severToken.balanceOf(user.address),
  });
});

// Ensure admin account exists with 50,000 tokens
async function ensureAdminAccount() {
  ensureUsersFile();
  let users = loadUsers();
  const adminUser = users.find((u) => u.username === "admin");
  if (!adminUser) {
    // Create a new wallet for admin
    const EC = require("elliptic").ec;
    const ec = new EC("secp256k1");
    const key = ec.genKeyPair();
    const address = key.getPublic("hex");
    // Give admin 50,000 tokens
    severToken.transfer("creator", address, 50000);
    const hash = await bcrypt.hash("admin", 10); // default password: admin
    users.push({
      username: "admin",
      passwordHash: hash,
      address,
      privateKey: key.getPrivate("hex"),
      code: "admin",
    });
    saveUsers(users);
    console.log("Admin account created. Username: admin, Password: admin");
  }
}
ensureAdminAccount();

// Simple basic auth middleware for admin endpoints
function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).send("Authentication required");
  }
  const b64 = auth.split(" ")[1];
  const [username, password] = Buffer.from(b64, "base64").toString().split(":");
  if (username !== "admin") {
    return res.status(401).send("Invalid credentials");
  }
  // Check password against admin hash
  const users = loadUsers();
  const adminUser = users.find((u) => u.username === "admin");
  if (!adminUser) return res.status(401).send("Admin not found");
  bcrypt.compare(password, adminUser.passwordHash).then((valid) => {
    if (!valid) return res.status(401).send("Invalid credentials");
    next();
  });
}

// Admin endpoint to list all usernames (no passwords)
app.get("/admin/users", (req, res) => {
  const users = loadUsers();
  res.json(users.map((u) => ({ username: u.username, address: u.address })));
});

// Admin endpoint to list all invitation codes and addresses (admin only)
app.get("/admin/invitation-codes", adminAuth, (req, res) => {
  res.json(
    Object.entries(invitationCodes).map(([code, wallet]) => ({
      code,
      address: wallet.address,
    }))
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
