const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

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

// Instantiate SeverToken with total supply allocated and distributed
const severToken = new Token("Sever N", "SN", 22500); // 15 wallets * 1500 tokens
// Distribute 1,500 tokens to 15 initial wallets
const initialWallets = [];
for (let i = 0; i < 15; i++) {
  const key = ec.genKeyPair();
  const address = key.getPublic("hex");
  initialWallets.push({ key, address });
  severToken.transfer("creator", address, 1500);
}

// export initialWallets array
module.exports = { severToken, ec, initialWallets };
