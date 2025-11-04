document.addEventListener("DOMContentLoaded", () => {
  console.log('🔄 Initializing Battery Flex Fund section...');

  const section = document.querySelector("#battery-flex-fund");
  if (!section) {
    console.warn('⚠️ Battery flex fund section not found');
    return;
  }

  console.log('✅ Battery flex fund section found');

  // Animate counters once when section scrolls into view
  const counters = section.querySelectorAll(".counter");
  const startCounters = () => {
    counters.forEach((el) => {
      if (el.classList.contains("done")) return;
      const target = parseFloat(el.dataset.target);
      const isDecimal = target % 1 !== 0;
      let count = 0;
      const step = target / 100;
      const update = () => {
        count += step;
        if (count >= target) count = target;
        el.textContent = isDecimal ? count.toFixed(1) : Math.floor(count);
        if (count < target) requestAnimationFrame(update);
      };
      el.classList.add("done");
      update();
    });
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          startCounters();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  obs.observe(section);

  // metrics‑controls toggle
  const metricBtns = document.querySelectorAll(
    ".fund-metrics-panel .metrics-control-btn"
  );
  metricBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelector(".metrics-control-btn.active")
        .classList.remove("active");
      btn.classList.add("active");
      document
        .querySelectorAll(".metrics-cards .metric-card")
        .forEach((card) => (card.style.display = "none"));
      document.getElementById(`${btn.dataset.view}-metric`).style.display =
        "block";
    });
  });

  // strategy-switch toggle
  document.querySelectorAll(".strategy-switch .strategy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".strategy-btn.active").classList.remove("active");
      btn.classList.add("active");
      document
        .querySelectorAll(".strategy-visualization")
        .forEach((v) => v.classList.add("hidden"));
      document
        .getElementById(`${btn.dataset.strategy}-viz`)
        .classList.remove("hidden");
    });
  });

  // count‑up animation
  document.querySelectorAll(".counter").forEach((el) => {
    const end = +el.dataset.target,
      step = end / 60;
    let v = 0;
    const id = setInterval(() => {
      v += step;
      el.textContent = v.toFixed(end % 1 ? 1 : 0);
      if (v >= end) {
        el.textContent = end;
        clearInterval(id);
      }
    }, 20);
  });

  // confetti on grant‑badge click
  document.getElementById("nrrpGrant")?.addEventListener("click", () => {
    if (typeof confetti === "function")
      confetti({ particleCount: 30, spread: 50 });
  });

  // tab switching
  const tabs = document.querySelectorAll(".chart-tab"),
    panes = document.querySelectorAll(".chart-display");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      panes.forEach(
        (p) =>
          (p.style.display =
            p.dataset.chart === tab.dataset.chart ? "block" : "none")
      );
    })
  );

  // Confetti on grant badge click
  const grant = document.getElementById("nrrpGrant"),
    canvas = document.getElementById("confettiCanvas");
  if (grant && window.confetti) {
    grant.addEventListener("click", () =>
      confetti.create(canvas, { resize: true, useWorker: true })()
    );
  }

  // Initialize all battery flex fund charts
  console.log('📊 Calling initBatteryFlexFundCharts()...');
  initBatteryFlexFundCharts();

  console.log('🎮 Setting up interactivity...');
  setupBatteryFlexFundInteractivity();

  console.log('✅ Battery Flex Fund initialization complete!');
});

// Global flag to prevent multiple initializations
window.batteryFlexFundChartsInitialized = window.batteryFlexFundChartsInitialized || false;

// Store chart instances globally so we can destroy them
window.batteryFlexFundChartInstances = window.batteryFlexFundChartInstances || {};

function initBatteryFlexFundCharts() {
  console.log('🎯 initBatteryFlexFundCharts() started');

  // Prevent multiple initializations
  if (window.batteryFlexFundChartsInitialized) {
    console.warn('⚠️ Battery flex fund charts already initialized, skipping...');
    return;
  }

  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.error('❌ Chart.js is not loaded. Battery fund charts will not render.');
    return;
  }

  console.log('✅ Chart.js is loaded');

  // Revenue Streams Chart
  const revenueChartElem = document.getElementById("revenueChart");
  console.log('🔍 Looking for revenueChart:', revenueChartElem ? '✅ Found' : '❌ Not found');

  let revenueCtx = null;
  if (revenueChartElem && revenueChartElem.tagName === "CANVAS") {
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(revenueChartElem);
    if (existingChart) {
      console.log('🗑️ Destroying existing revenueChart');
      existingChart.destroy();
    }

    revenueCtx = revenueChartElem.getContext("2d");
    console.log('✅ Got 2D context for revenueChart');
  }
  if (revenueCtx) {
    window.batteryFlexFundChartInstances.revenueChart = new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Frequency Regulation",
            data: [345, 378, 392, 421, 460, 482, 494],
            borderColor: "rgba(0, 255, 255, 0.8)",
            backgroundColor: "rgba(0, 255, 255, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Energy Arbitrage",
            data: [210, 245, 267, 305, 332, 346, 360],
            borderColor: "rgba(0, 255, 150, 0.8)",
            backgroundColor: "rgba(0, 255, 150, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Capacity Payments",
            data: [125, 125, 125, 140, 140, 140, 155],
            borderColor: "rgba(150, 255, 0, 0.8)",
            backgroundColor: "rgba(150, 255, 0, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": €";
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(0) + "k";
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              callback: function (value) {
                return "€" + value + "k";
              },
            },
          },
        },
      },
    });
  }

  // Frequency Response Chart
  const frequencyChartElem = document.getElementById("frequencyChart");
  console.log('🔍 Looking for frequencyChart:', frequencyChartElem ? '✅ Found' : '❌ Not found');

  let frequencyCtx = null;
  if (frequencyChartElem && frequencyChartElem.tagName === "CANVAS") {
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(frequencyChartElem);
    if (existingChart) {
      console.log('🗑️ Destroying existing frequencyChart');
      existingChart.destroy();
    }

    frequencyCtx = frequencyChartElem.getContext("2d");
    console.log('✅ Got 2D context for frequencyChart');
  }
  if (frequencyCtx) {
    window.batteryFlexFundChartInstances.frequencyChart = new Chart(frequencyCtx, {
      type: "line",
      data: {
        labels: Array.from({ length: 100 }, (_, i) => i),
        datasets: [
          {
            label: "Grid Frequency",
            data: generateFrequencyData(100),
            borderColor: "rgba(0, 255, 255, 0.8)",
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: "Response",
            data: generateResponseData(100),
            borderColor: "rgba(255, 120, 0, 0.8)",
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [5, 5],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              boxWidth: 12,
              font: {
                size: 10,
              },
            },
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            min: 49.5,
            max: 50.5,
          },
        },
        animation: {
          duration: 0,
        },
      },
    });
  }

  // Market Price Chart
  const marketPriceChartElem = document.getElementById("marketPriceChart");
  console.log('🔍 Looking for marketPriceChart:', marketPriceChartElem ? '✅ Found' : '❌ Not found');

  let marketPriceCtx = null;
  if (marketPriceChartElem && marketPriceChartElem.tagName === "CANVAS") {
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(marketPriceChartElem);
    if (existingChart) {
      console.log('🗑️ Destroying existing marketPriceChart');
      existingChart.destroy();
    }

    marketPriceCtx = marketPriceChartElem.getContext("2d");
    console.log('✅ Got 2D context for marketPriceChart');
  }
  if (marketPriceCtx) {
    window.batteryFlexFundChartInstances.marketPriceChart = new Chart(marketPriceCtx, {
      type: "line",
      data: {
        labels: generateTimeLabels(24),
        datasets: [
          {
            label: "Market Price",
            data: generateMarketPriceData(24),
            borderColor: "rgba(0, 255, 255, 0.8)",
            backgroundColor: "rgba(0, 255, 255, 0.2)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "24h Average",
            data: Array(24).fill(135),
            borderColor: "rgba(255, 255, 255, 0.5)",
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
          },
          {
            label: "Buy Threshold",
            data: Array(24).fill(105),
            borderColor: "rgba(255, 150, 0, 0.8)",
            borderWidth: 1,
            borderDash: [2, 2],
            pointRadius: 0,
          },
          {
            label: "Sell Threshold",
            data: Array(24).fill(165),
            borderColor: "rgba(0, 255, 150, 0.8)",
            borderWidth: 1,
            borderDash: [2, 2],
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += "€" + context.parsed.y.toFixed(2) + "/MWh";
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              maxTicksLimit: 12,
            },
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              callback: function (value) {
                return "€" + value;
              },
            },
          },
        },
      },
    });

    // Simulate live data updates
    setInterval(() => {
      const chart = window.batteryFlexFundChartInstances.marketPriceChart;
      if (chart && chart.data && chart.data.datasets[0]) {
        const data = chart.data.datasets[0].data;
        data.shift();
        data.push(generateRandomMarketPrice());
        chart.update();
      }
    }, 10000);
  }

  // Revenue Allocation Pie Chart
  const revenueAllocationChartElem = document.getElementById(
    "revenueAllocationChart"
  );
  console.log('🔍 Looking for revenueAllocationChart:', revenueAllocationChartElem ? '✅ Found' : '❌ Not found');

  let revenueAllocationCtx = null;
  if (
    revenueAllocationChartElem &&
    revenueAllocationChartElem.tagName === "CANVAS"
  ) {
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(revenueAllocationChartElem);
    if (existingChart) {
      console.log('🗑️ Destroying existing revenueAllocationChart');
      existingChart.destroy();
    }

    revenueAllocationCtx = revenueAllocationChartElem.getContext("2d");
    console.log('✅ Got 2D context for revenueAllocationChart');
  }
  if (revenueAllocationCtx) {
    window.batteryFlexFundChartInstances.revenueAllocationChart = new Chart(revenueAllocationCtx, {
      type: "doughnut",
      data: {
        labels: [
          "Frequency Regulation",
          "Energy Arbitrage",
          "Capacity Market",
          "Ancillary Services",
        ],
        datasets: [
          {
            data: [45, 30, 15, 10],
            backgroundColor: [
              "rgba(0, 255, 255, 0.8)",
              "rgba(0, 255, 150, 0.8)",
              "rgba(150, 255, 0, 0.8)",
              "rgba(255, 200, 0, 0.8)",
            ],
            borderColor: "rgba(0, 0, 0, 0.3)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        cutout: "65%",
      },
    });
  }

  // Add animated flow to system diagram
  animateDataFlow();

  // Mark as initialized
  window.batteryFlexFundChartsInitialized = true;
  console.log('✅ All Battery Flex Fund charts initialized successfully!');
}

function setupBatteryFlexFundInteractivity() {
  // Panel controls for the Performance & Market Data section
  const panelButtons = document.querySelectorAll(
    ".battery-flex-fund .panel-controls .btn-sm"
  );
  panelButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      panelButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      // Here you would normally update the chart data based on the timeframe
    });
  });

  // Chart tab container for the market charts
  const chartTabButtons = document.querySelectorAll(
    ".battery-flex-fund .chart-tab-container .btn-sm"
  );
  chartTabButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      chartTabButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      // Here you would switch between different chart displays
    });
  });

  // Request Investment Memorandum button
  const requestButton = document.querySelector(
    ".battery-flex-fund .btn-primary"
  );
  if (requestButton) {
    requestButton.addEventListener("click", function () {
      showInvestmentRequestModal();
    });
  }

  // Add hover effects to metrics
  const metricCards = document.querySelectorAll(
    ".battery-flex-fund .metric-card"
  );
  metricCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.boxShadow = "";
    });
  });
}

// Helper function to show investment request modal
function showInvestmentRequestModal() {
  alert(
    "Investment Memorandum request functionality will be implemented in the next phase."
  );
}

// Helper function to generate frequency data
function generateFrequencyData(count) {
  const baseFrequency = 50;
  return Array.from(
    { length: count },
    () => baseFrequency + (Math.random() * 0.4 - 0.2)
  );
}

// Helper function to generate response data with slight delay from frequency
function generateResponseData(count) {
  const frequency = generateFrequencyData(count);
  return frequency.map((val, i) => {
    if (i < 5) return 50;
    const diff = val - 50;
    return 50 - diff * 0.85;
  });
}

// Helper function to generate market price data
function generateMarketPriceData(count) {
  const basePrice = 135;
  return Array.from(
    { length: count },
    () => basePrice + (Math.random() * 60 - 30)
  );
}

// Helper function to generate a random market price that continues the trend
function generateRandomMarketPrice() {
  return 135 + (Math.random() * 60 - 30);
}

// Helper function to generate time labels for the market price chart
function generateTimeLabels(count) {
  const labels = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    labels.push(time.getHours() + ":00");
  }
  return labels;
}

// Helper function to animate the data flow in the system diagram
function animateDataFlow() {
  const chargingFlow = document.querySelector(
    ".battery-flex-fund .data-flow.charging"
  );
  const dischargingFlow = document.querySelector(
    ".battery-flex-fund .data-flow.discharging"
  );

  if (chargingFlow && dischargingFlow) {
    // Alternate between charging and discharging
    let isCharging = true;

    setInterval(() => {
      if (isCharging) {
        chargingFlow.style.opacity = "1";
        dischargingFlow.style.opacity = "0";
      } else {
        chargingFlow.style.opacity = "0";
        dischargingFlow.style.opacity = "1";
      }
      isCharging = !isCharging;
    }, 5000);
  }
}
