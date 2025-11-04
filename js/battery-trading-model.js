document.addEventListener("DOMContentLoaded", () => {
  const chartElem = document.getElementById("batteryTradingChart");
  if (!chartElem) {
    console.error("batteryTradingChart canvas not found!");
    return;
  }

  // Initialize Chart.js on the batteryTradingChart canvas
  const ctx = chartElem.getContext("2d");
  const tradingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["0h", "4h", "8h", "12h", "16h", "20h", "24h"],
      datasets: [
        {
          label: "Buy Price (€)",
          data: [0.12, 0.11, 0.115, 0.13, 0.125, 0.12, 0.118],
          borderColor: "#00cc99",
          fill: false,
        },
        {
          label: "Sell Price (€)",
          data: [0.13, 0.12, 0.128, 0.14, 0.135, 0.13, 0.128],
          borderColor: "#ff4d4d",
          fill: false,
        },
        {
          label: "State of Charge (%)",
          data: [60, 62, 65, 63, 67, 70, 68],
          borderColor: "#3399ff",
          yAxisID: "socAxis",
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          position: "left",
        },
        socAxis: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false },
          title: { display: true, text: "SOC (%)" },
        },
      },
      plugins: {
        legend: { position: "bottom" },
        tooltip: { mode: "index", intersect: false },
      },
      interaction: { mode: "nearest", axis: "x", intersect: false },
    },
  });

  // Timeframe buttons toggle (improved and functional)
  const timeframeBtns = document.querySelectorAll(
    "#battery-storage-model .timeframe-btn"
  );
  timeframeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      timeframeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updateChart(btn.dataset.timeframe);
    });
  });

  // Utility to update chart based on timeframe selection
  function updateChart(tf) {
    let labels, buyData, sellData, socData;
    if (tf === "day") {
      labels = ["0h", "4h", "8h", "12h", "16h", "20h", "24h"];
      buyData = [0.12, 0.11, 0.115, 0.13, 0.125, 0.12, 0.118];
      sellData = [0.13, 0.12, 0.128, 0.14, 0.135, 0.13, 0.128];
      socData = [60, 62, 65, 63, 67, 70, 68];
    } else if (tf === "week") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      buyData = [0.12, 0.122, 0.118, 0.124, 0.128, 0.13, 0.126];
      sellData = [0.13, 0.132, 0.128, 0.134, 0.138, 0.14, 0.136];
      socData = [60, 62, 64, 63, 65, 66, 68];
    } else if (tf === "month") {
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
      buyData = Array.from({ length: 30 }, () =>
        Number((0.11 + Math.random() * 0.004).toFixed(3))
      );
      sellData = Array.from({ length: 30 }, () =>
        Number((0.13 + Math.random() * 0.004).toFixed(3))
      );
      socData = Array.from(
        { length: 30 },
        () => 60 + Math.floor(Math.random() * 15)
      );
    }
    tradingChart.data.labels = labels;
    tradingChart.data.datasets[0].data = buyData;
    tradingChart.data.datasets[1].data = sellData;
    tradingChart.data.datasets[2].data = socData;
    tradingChart.update();
  }
});
