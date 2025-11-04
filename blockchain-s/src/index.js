// src/index.js
const crypto = require("crypto");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const P2P = require("./p2p");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.previousHash +
          this.timestamp +
          JSON.stringify(this.data) +
          this.nonce
      )
      .digest("hex");
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

// Transaction with signature support
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(this.fromAddress + this.toAddress + this.amount)
      .digest("hex");
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.fromAddress === null) return true; // mining reward
    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(0, Date.now().toString(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    // broadcast updated chain to peers
    P2P.broadcastChain(this.chain);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }

  static isValidChain(chain) {
    if (chain[0].previousHash !== "0") return false;
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const previous = chain[i - 1];
      const recalculatedHash = crypto
        .createHash("sha256")
        .update(
          current.index +
            current.previousHash +
            current.timestamp +
            JSON.stringify(current.data) +
            current.nonce
        )
        .digest("hex");
      if (current.hash !== recalculatedHash) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("Received chain is not longer than current chain.");
      return;
    }
    if (!Blockchain.isValidChain(newChain)) {
      console.log("Received chain is invalid.");
      return;
    }
    console.log("Replacing blockchain with the new chain.");
    this.chain = newChain;
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to addresses");
    }
    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }
    this.pendingTransactions.push(transaction);
    // broadcast new transaction to peers
    P2P.broadcastTransaction(transaction);
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    );
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      this.chain.length,
      Date.now().toString(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      const transactions = Array.isArray(block.data) ? block.data : [];
      for (const tx of transactions) {
        if (tx.fromAddress === address) {
          balance -= tx.amount;
        }
        if (tx.toAddress === address) {
          balance += tx.amount;
        }
      }
    }
    return balance;
  }
}

// Token implementation for 1,000,000 supply
class Token {
  constructor(name, symbol, totalSupply) {
    this.name = name;
    this.symbol = symbol;
    this.totalSupply = totalSupply;
    this.balances = {};
    this.balances["creator"] = totalSupply;
  }

  transfer(from, to, amount) {
    if (this.balances[from] >= amount) {
      this.balances[from] -= amount;
      this.balances[to] = (this.balances[to] || 0) + amount;
      return true;
    }
    return false;
  }

  balanceOf(address) {
    return this.balances[address] || 0;
  }
}

// Example usage
const severNetwork = new Blockchain();

// initialize P2P network layer
P2P.initP2PServer(severNetwork);
P2P.connectToPeers(severNetwork);

console.log("Mining block 1...");
severNetwork.addBlock(new Block(1, Date.now().toString(), { amount: 4 }));
console.log("Mining block 2...");
severNetwork.addBlock(new Block(2, Date.now().toString(), { amount: 10 }));

console.log(JSON.stringify(severNetwork, null, 2));

// create token instance named Sever N with total supply 15000
const severToken = new Token("Sever N", "SN", 15000);
console.log(`Token: ${severToken.name} (${severToken.symbol})`);
console.log(`Total supply: ${severToken.totalSupply}`);
console.log(`Creator balance: ${severToken.balanceOf("creator")}`);

// Distribute 1,000 tokens to 15 initial wallets
const initialWallets = [];
for (let i = 0; i < 15; i++) {
  const key = ec.genKeyPair();
  const address = key.getPublic("hex");
  initialWallets.push({ key, address });
  severToken.transfer("creator", address, 1000);
}
console.log(`Creator remaining balance: ${severToken.balanceOf("creator")}`);
initialWallets.forEach(({ address }, idx) => {
  console.log(
    `Wallet ${idx + 1}: ${address}, balance: ${severToken.balanceOf(address)}`
  );
});

// Example usage of transaction feature
const myKey = ec.genKeyPair();
const myWalletAddress = myKey.getPublic("hex");

const tx1 = new Transaction(myWalletAddress, "public-key-of-recipient", 50);
tx1.signTransaction(myKey);
severNetwork.addTransaction(tx1);

console.log("Starting the miner...");
severNetwork.minePendingTransactions(myWalletAddress);

console.log(
  `Balance of miner is ${severNetwork.getBalanceOfAddress(myWalletAddress)}`
);
