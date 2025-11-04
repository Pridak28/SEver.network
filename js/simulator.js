document.addEventListener("DOMContentLoaded", () => {
  let walletBalance = 10000;
  const balanceEl = document.querySelector(".wallet-balance .balance-value");
  const historyEl = document.getElementById("transactionList");
  const typeBtns = document.querySelectorAll(".transaction-type-btn");
  const sources = document.querySelectorAll(".energy-source");
  const amountInput = document.getElementById("tradeAmount");
  const executeBtn = document.querySelector(".execute-btn");
  const refreshBtn = document.querySelector(".refresh-btn");

  function renderBalance() {
    if (balanceEl) {
      balanceEl.textContent = walletBalance.toFixed(2);
    }
  }
  renderBalance();

  // select buy/sell
  let txType = "buy";
  typeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      typeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      txType = btn.dataset.type;
    });
  });

  // select source
  let selectedSource = null;
  sources.forEach((src) => {
    src.addEventListener("click", () => {
      sources.forEach((s) => s.classList.remove("selected"));
      src.classList.add("selected");
      selectedSource = src;
    });
  });

  // execute trade
  executeBtn.addEventListener("click", () => {
    const qty = parseFloat(amountInput.value);
    if (!selectedSource || isNaN(qty) || qty <= 0) {
      return alert("Select a source and enter a valid amount.");
    }
    const price = parseFloat(
      selectedSource.querySelector(".source-price").textContent
    );
    const cost = qty * price;
    if (txType === "buy" && cost > walletBalance) {
      return alert("Insufficient balance.");
    }
    walletBalance += txType === "buy" ? -cost : cost;
    renderBalance();

    const li = document.createElement("li");
    li.className = `transaction-item ${txType}`;
    li.innerHTML = `
      <span>${txType.toUpperCase()} ${qty} @ ${price.toFixed(2)}</span>
      <span>${new Date().toLocaleTimeString()}</span>
    `;
    historyEl.prepend(li);
    amountInput.value = "";
  });

  // refresh prices
  refreshBtn.addEventListener("click", () => {
    sources.forEach((src) => {
      const newPrice = (Math.random() * 5 + 20).toFixed(2);
      src.querySelector(".source-price").textContent = newPrice;
    });
  });
});
