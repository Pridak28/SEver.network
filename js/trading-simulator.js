document.addEventListener("DOMContentLoaded", () => {
  // === Trading Simulator State ===
  const state = {
    wallet: 10000,
    selectedSource: null,
    transactionType: "buy",
    prices: {
      solar: 24.35,
      wind: 18.72,
      hydro: 29.84,
    },
    holdings: {
      solar: 0,
      wind: 0,
      hydro: 0,
    },
    priceHistory: {
      solar: Array(24)
        .fill(0)
        .map(() => 20 + Math.random() * 10),
      wind: Array(24)
        .fill(0)
        .map(() => 15 + Math.random() * 8),
      hydro: Array(24)
        .fill(0)
        .map(() => 25 + Math.random() * 12),
    },
  };

  // === DOM Elements ===
  const elements = {
    wallet: document.querySelector(".wallet-balance .balance-value"),
    sources: document.querySelectorAll(".energy-source"),
    typeButtons: document.querySelectorAll(".transaction-type-btn"),
    amountInput: document.getElementById("tradeAmount"),
    executeBtn: document.querySelector(".execute-btn"),
    refreshBtn: document.querySelector(".refresh-btn"),
    transactionList: document.getElementById("transactionList"),
    priceChart: document.querySelector(".energy-price-chart"),
    blockchainContainer: document.querySelector(".blockchain-container"),
  };

  // Initialize chart canvas - Use existing canvas instead of creating new one
  const chart = {
    canvas: document.getElementById("energyPriceChart"),
    ctx: null,
    init() {
      if (!this.canvas) {
        console.error("energyPriceChart canvas not found");
        return;
      }
      const container = this.canvas.parentElement;
      this.canvas.width = container.clientWidth || 800;
      this.canvas.height = container.clientHeight || 300;
      this.ctx = this.canvas.getContext("2d");
      window.addEventListener("resize", () => {
        this.canvas.width = container.clientWidth || 800;
        this.canvas.height = container.clientHeight || 300;
        this.draw();
      });
    },
    draw(sourceType = "solar") {
      const ctx = this.ctx;
      const prices = state.priceHistory[sourceType];
      const width = this.canvas.width;
      const height = this.canvas.height;
      const padding = 20;
      const maxPrice = Math.max(...prices) * 1.1;
      const minPrice = Math.min(...prices) * 0.9;
      const priceRange = maxPrice - minPrice;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw price line
      ctx.beginPath();
      ctx.moveTo(
        padding,
        height -
          padding -
          ((prices[0] - minPrice) / priceRange) * (height - padding * 2)
      );

      prices.forEach((price, i) => {
        const x = padding + (i / (prices.length - 1)) * (width - padding * 2);
        const y =
          height -
          padding -
          ((price - minPrice) / priceRange) * (height - padding * 2);
        ctx.lineTo(x, y);
      });

      // Style the line based on source type
      let gradient;
      if (sourceType === "solar") {
        gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "rgba(0, 255, 255, 0.8)");
        gradient.addColorStop(1, "rgba(0, 255, 255, 0.1)");
      } else if (sourceType === "wind") {
        gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "rgba(0, 255, 0, 0.8)");
        gradient.addColorStop(1, "rgba(0, 255, 0, 0.1)");
      } else {
        gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "rgba(200, 0, 255, 0.8)");
        gradient.addColorStop(1, "rgba(200, 0, 255, 0.1)");
      }

      ctx.strokeStyle =
        sourceType === "solar"
          ? "#00ffff"
          : sourceType === "wind"
          ? "#00ff00"
          : "#cc00ff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Fill area under the line
      ctx.lineTo(width - padding, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw price labels
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px Arial";
      ctx.fillText(`$${maxPrice.toFixed(2)}`, 5, padding);
      ctx.fillText(`$${minPrice.toFixed(2)}`, 5, height - padding);

      // Draw grid lines
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < 5; i++) {
        const y = padding + (i * (height - padding * 2)) / 4;
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
      }

      for (let i = 0; i < 6; i++) {
        const x = padding + (i * (width - padding * 2)) / 5;
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
      }

      ctx.stroke();
    },
  };

  // === Initialize UI ===
  function initUI() {
    // Set initial wallet balance
    updateWalletDisplay();

    // Initialize energy source prices
    updateSourcePrices();

    // Initialize chart
    chart.init();
    chart.draw("solar");

    // Select first source by default
    elements.sources[0].classList.add("selected");
    state.selectedSource = "solar";

    // Set active transaction type
    elements.typeButtons[0].classList.add("active");
  }

  // === UI Update Functions ===
  function updateSourcePrices() {
    elements.sources.forEach((source) => {
      const type = source.classList.contains("source-solar")
        ? "solar"
        : source.classList.contains("source-wind")
        ? "wind"
        : "hydro";

      const priceEl = source.querySelector(".source-price");
      const oldPrice = parseFloat(priceEl.textContent || "0");
      const newPrice = state.prices[type];

      // Set up price animation
      if (oldPrice && oldPrice !== newPrice) {
        const trend = source.querySelector(".source-trend");
        if (newPrice > oldPrice) {
          trend.innerHTML =
            '<i class="fas fa-arrow-up"></i> +' +
            (newPrice - oldPrice).toFixed(2);
          trend.className = "source-trend up";
        } else {
          trend.innerHTML =
            '<i class="fas fa-arrow-down"></i> -' +
            (oldPrice - newPrice).toFixed(2);
          trend.className = "source-trend down";
        }

        // Animate price change
        let startValue = oldPrice;
        const animatePrice = () => {
          if (Math.abs(startValue - newPrice) < 0.01) {
            priceEl.textContent = newPrice.toFixed(2);
            return;
          }

          startValue += (newPrice - oldPrice) / 10;
          priceEl.textContent = startValue.toFixed(2);
          requestAnimationFrame(animatePrice);
        };

        animatePrice();
      } else {
        priceEl.textContent = newPrice.toFixed(2);
      }
    });
  }

  let walletUpdateScheduled = false;
  function updateWalletDisplay(amount) {
    if (!walletUpdateScheduled) {
      walletUpdateScheduled = true;
      requestAnimationFrame(() => {
        if (elements.wallet) {
          const walletValue = typeof amount === "number" && !isNaN(amount)
            ? amount.toFixed(2)
            : state.wallet.toFixed(2);
          elements.wallet.textContent = `$${walletValue}`;
        }
        walletUpdateScheduled = false;
      });
    }
  }

  function updatePriceChart() {
    // Update chart with current selected source
    chart.draw(state.selectedSource);
  }

  function addBlockchainBlock(transaction) {
    // Create new blockchain block for visualization
    const blockEl = document.createElement("div");
    blockEl.className = `blockchain-block ${state.selectedSource}-block new-block`;

    const timestamp = new Date().toLocaleTimeString();
    const hash = Math.random().toString(36).substring(2, 10);

    blockEl.innerHTML = `
      <div class="block-header">
        <span class="block-type">${state.selectedSource.toUpperCase()}</span>
        <span class="block-hash">${hash}</span>
      </div>
      <div class="block-content">
        <div class="block-info">${transaction.type} ${transaction.amount}</div>
        <div class="block-price">$${transaction.price.toFixed(2)}</div>
      </div>
    `;

    elements.blockchainContainer.appendChild(blockEl);

    // Animation for new block
    setTimeout(() => {
      blockEl.classList.remove("new-block");
      // Keep only last 5 blocks
      if (elements.blockchainContainer.children.length > 5) {
        elements.blockchainContainer.removeChild(
          elements.blockchainContainer.children[0]
        );
      }
    }, 2000);
  }

  function addTransactionToHistory(transaction) {
    const li = document.createElement("li");
    li.className = `transaction-item ${transaction.type}`;
    li.innerHTML = `
      <div class="tx-info">
        <span class="tx-type">${transaction.type}</span>
        <span>${transaction.amount} ${transaction.source}</span>
      </div>
      <div class="tx-price">$${transaction.price.toFixed(2)}</div>
      <div class="tx-time">${transaction.time}</div>
    `;

    elements.transactionList.prepend(li);
    li.classList.add("new");

    // Remove highlight after animation
    setTimeout(() => {
      li.classList.remove("new");
    }, 3000);

    // Keep only 10 most recent transactions
    if (elements.transactionList.children.length > 10) {
      elements.transactionList.removeChild(elements.transactionList.lastChild);
    }
  }

  // === Market Simulation ===
  function simulateMarket() {
    // Adjust prices randomly with some bias based on previous trend
    ["solar", "wind", "hydro"].forEach((type) => {
      // Get price history
      const history = state.priceHistory[type];
      const currentPrice = history[history.length - 1];

      // Calculate trend (positive or negative)
      const trend =
        history[history.length - 1] > history[history.length - 2] ? 1 : -1;

      // Generate new price with bias toward trend continuation
      const change = (Math.random() * 2 - 0.5 + trend * 0.3) * 0.5;
      let newPrice = currentPrice + change;

      // Ensure price stays within reasonable bounds
      newPrice = Math.max(10, Math.min(40, newPrice));

      // Update price history
      history.push(newPrice);
      history.shift();

      // Update current price
      state.prices[type] = newPrice;
    });

    // Update UI
    updateSourcePrices();
    updatePriceChart();
  }

  // === Event Handlers ===
  function setupEventListeners() {
    // Energy source selection
    elements.sources.forEach((source) => {
      source.addEventListener("click", () => {
        // Remove selected class from all sources
        elements.sources.forEach((s) => s.classList.remove("selected"));

        // Add selected class to clicked source
        source.classList.add("selected");

        // Set selected source in state
        state.selectedSource = source.classList.contains("source-solar")
          ? "solar"
          : source.classList.contains("source-wind")
          ? "wind"
          : "hydro";

        // Update chart
        updatePriceChart();
      });
    });

    // Transaction type toggle
    elements.typeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all type buttons
        elements.typeButtons.forEach((b) => b.classList.remove("active"));

        // Add active class to clicked button
        button.classList.add("active");

        // Set transaction type in state
        state.transactionType = button.dataset.type;
      });
    });

    // Execute transaction
    elements.executeBtn.addEventListener("click", executeTransaction);

    // Refresh market data
    elements.refreshBtn.addEventListener("click", () => {
      simulateMarket();
      elements.refreshBtn.classList.add("refreshing");

      setTimeout(() => {
        elements.refreshBtn.classList.remove("refreshing");
      }, 1000);
    });
  }

  function executeTransaction() {
    // Validate transaction inputs
    const amount = parseFloat(elements.amountInput.value);
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Get current price for selected energy source
    const price = state.prices[state.selectedSource];
    const totalCost = price * amount;

    // Check wallet balance for buy transactions
    if (state.transactionType === "buy" && totalCost > state.wallet) {
      alert("Insufficient balance");
      return;
    }

    // Check holdings for sell transactions
    if (
      state.transactionType === "sell" &&
      amount > state.holdings[state.selectedSource]
    ) {
      alert(`You don't have enough ${state.selectedSource} to sell`);
      return;
    }

    // Process transaction
    if (state.transactionType === "buy") {
      state.wallet -= totalCost;
      state.holdings[state.selectedSource] += amount;
    } else {
      state.wallet += totalCost;
      state.holdings[state.selectedSource] -= amount;
    }

    // Record transaction
    const transaction = {
      type: state.transactionType,
      source: state.selectedSource,
      amount: amount,
      price: price,
      total: totalCost,
      time: new Date().toLocaleTimeString(),
    };

    // Update UI
    updateWalletDisplay();
    addTransactionToHistory(transaction);

    // Connect with blockchain visualizer if available
    if (window.addBlockchainTransaction) {
      window.addBlockchainTransaction(transaction);
    } else {
      // Original blockchain block code if visualizer not loaded
      addBlockchainBlock(transaction);
    }

    elements.amountInput.value = "";

    // Apply transaction effect on price (small impact)
    const priceImpact = state.transactionType === "buy" ? 0.2 : -0.2;
    state.prices[state.selectedSource] += (amount * priceImpact) / 100;
    updateSourcePrices();

    // Update price history
    state.priceHistory[state.selectedSource][
      state.priceHistory[state.selectedSource].length - 1
    ] = state.prices[state.selectedSource];
    updatePriceChart();
  }

  // === Market auto-update ===
  function startMarketSimulation() {
    // Update market every 15 seconds
    setInterval(simulateMarket, 15000);
  }

  // === Initialize the Simulator ===
  function initSimulator() {
    initUI();
    setupEventListeners();
    startMarketSimulation();
  }

  // Add flag to indicate trading simulator is initialized
  window.tradingSimulatorInitialized = true;

  // Start the simulator
  initSimulator();
});
