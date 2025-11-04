document.addEventListener("DOMContentLoaded", () => {
  // Initialize blockchain visualization with sample data
  const blockchainContainer = document.querySelector(".blockchain-container");
  const blocksData = [
    { type: "solar", amount: 25, price: 24.35, hash: "a7f43c2d" },
    { type: "wind", amount: 18, price: 18.72, hash: "b9e12f8a" },
    { type: "hydro", amount: 30, price: 29.84, hash: "c3d56b1e" },
  ];

  // Function to create blockchain blocks with animation
  function createBlock(data, isNew = false) {
    const blockEl = document.createElement("div");
    blockEl.className = `blockchain-block ${data.type}-block`;
    if (isNew) blockEl.classList.add("new-block");

    blockEl.innerHTML = `
      <div class="block-header">
        <span class="block-type">${data.type.toUpperCase()}</span>
        <span class="block-hash">${data.hash}</span>
      </div>
      <div class="block-content">
        <div class="block-info">${data.type === "buy" ? "BUY" : "SELL"} ${
      data.amount
    }</div>
        <div class="block-price">$${data.price.toFixed(2)}</div>
      </div>
    `;

    const container = document.getElementById("blockchain3DContainer");
    container.appendChild(blockEl);

    // Stagger animation for new blocks
    if (isNew) {
      setTimeout(() => {
        blockEl.classList.remove("new-block");
      }, 2000);
    }
  }

  // Add initial blocks
  blocksData.forEach((block) => createBlock(block));

  // Add transaction chart
  const chartContainer = document.createElement("div");
  chartContainer.className = "blockchain-chart";
  chartContainer.innerHTML = `
    <h3>Transaction History</h3>
    <canvas id="transactionChart"></canvas>
  `;

  // Insert after blockchain container
  const blockchainVisualization = document.querySelector(
    ".blockchain-visualization"
  );
  blockchainVisualization.appendChild(chartContainer);

  // Initialize chart
  const ctx = document.getElementById("transactionChart").getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(0, 255, 255, 0.5)");
  gradient.addColorStop(1, "rgba(0, 255, 255, 0.1)");

  // Sample chart data
  const chart = {
    labels: ["", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Transaction Volume",
        data: [15, 22, 18, 25, 30, 28, 35, 32, 38, 42, 40, 45],
        borderColor: "rgb(0, 255, 255)",
        backgroundColor: gradient,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Create chart (using Canvas API for compatibility instead of Chart.js)
  function drawChart() {
    const canvas = document.getElementById("transactionChart");
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = 400);
    const height = (canvas.height = 200);
    const data = chart.datasets[0].data;
    const maxValue = Math.max(...data) * 1.1;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < 5; i++) {
      const y = (i * height) / 4;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(0, height - (data[0] / maxValue) * height);
    for (let i = 1; i < data.length; i++) {
      const x = i * (width / (data.length - 1));
      const y = height - (data[i] / maxValue) * height;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgb(0, 255, 255)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill area
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // Add tech stats
  const techStatsContainer = document.createElement("div");
  techStatsContainer.className = "blockchain-tech-stats";
  techStatsContainer.innerHTML = `
    <div class="tech-stats-grid">
      <div class="tech-stat">
        <div class="tech-stat-icon"><i class="fas fa-cube"></i></div>
        <div class="tech-stat-value">152</div>
        <div class="tech-stat-label">Blocks Mined</div>
      </div>
      <div class="tech-stat">
        <div class="tech-stat-icon"><i class="fas fa-bolt"></i></div>
        <div class="tech-stat-value">2.4 kW</div>
        <div class="tech-stat-label">Energy Per Block</div>
      </div>
      <div class="tech-stat">
        <div class="tech-stat-icon"><i class="fas fa-tachometer-alt"></i></div>
        <div class="tech-stat-value">182 ms</div>
        <div class="tech-stat-label">Confirmation Time</div>
      </div>
      <div class="tech-stat">
        <div class="tech-stat-icon"><i class="fas fa-users"></i></div>
        <div class="tech-stat-value">248</div>
        <div class="tech-stat-label">Network Nodes</div>
      </div>
    </div>
  `;

  blockchainVisualization.appendChild(techStatsContainer);

  // Add event to the global window so trading-simulator.js can trigger a new block
  window.addBlockchainTransaction = function (transaction) {
    // Create a new hash
    const hash = Math.random().toString(36).substring(2, 8);

    // Create block data
    const blockData = {
      type: transaction.source || "solar",
      amount: transaction.amount || 0,
      price: transaction.price || 0,
      hash: hash,
    };

    // Add the block with animation
    createBlock(blockData, true);

    // Keep only the last 5 blocks
    if (blockchainContainer.children.length > 5) {
      blockchainContainer.removeChild(blockchainContainer.children[0]);
    }

    // Update chart with new data
    chart.datasets[0].data.push(transaction.amount);
    chart.datasets[0].data.shift();
    drawChart();
  };

  // If we have trading-simulator.js, hook into it
  if (window.tradingSimulatorInitialized) {
    console.log("Connecting to trading simulator...");
  } else {
    // Otherwise, simulate transactions for demo
    setInterval(() => {
      const types = ["solar", "wind", "hydro"];
      const actions = ["buy", "sell"];
      const randomTransaction = {
        source: types[Math.floor(Math.random() * types.length)],
        type: actions[Math.floor(Math.random() * actions.length)],
        amount: Math.floor(Math.random() * 30) + 10,
        price: (Math.random() * 15 + 15).toFixed(2),
      };

      window.addBlockchainTransaction(randomTransaction);
    }, 8000);
  }

  // Initial chart draw
  setTimeout(drawChart, 500);

  // Responsive chart sizing for mobile/iOS
  function resizeChartForMobile() {
    const canvas = document.getElementById("transactionChart");
    if (!canvas) return;
    if (window.innerWidth <= 768) {
      canvas.width = window.innerWidth - 32;
      canvas.height = 120;
    } else {
      canvas.width = 400;
      canvas.height = 200;
    }
    drawChart();
  }
  window.addEventListener("resize", resizeChartForMobile);
  resizeChartForMobile();
});
