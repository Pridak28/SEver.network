// Chart Diagnostic Tool - Run this in browser console after page loads
(function() {
  console.log('====== CHART DIAGNOSTIC TOOL ======');

  // Check if Chart.js is loaded
  console.log('\n1. Chart.js Status:');
  if (typeof Chart === 'undefined') {
    console.error('❌ Chart.js NOT loaded!');
    return;
  } else {
    console.log('✅ Chart.js loaded, version:', Chart.version);
  }

  // Check initialization flags
  console.log('\n2. Initialization Flags:');
  console.log('Energy Dashboard initialized:', window.energyDashboardChartsInitialized || false);
  console.log('Battery Flex Fund initialized:', window.batteryFlexFundChartsInitialized || false);

  // List of all expected canvas IDs
  const expectedCanvases = [
    'energyProductionChart',
    'networkActivityChart',
    'revenueChart',
    'frequencyChart',
    'marketPriceChart',
    'revenueAllocationChart',
    'energyPriceChart',
    'consumptionBreakdownChart'
  ];

  console.log('\n3. Canvas Elements:');
  expectedCanvases.forEach(id => {
    const canvas = document.getElementById(id);
    if (canvas) {
      const chart = Chart.getChart(canvas);
      console.log(`✅ ${id}: Found, Chart ${chart ? 'EXISTS' : 'NOT CREATED'}`);
      if (chart) {
        console.log(`   Type: ${chart.config.type}, Datasets: ${chart.data.datasets.length}`);
      }
    } else {
      console.log(`❌ ${id}: Canvas NOT found in DOM`);
    }
  });

  // Check chart instances storage
  console.log('\n4. Stored Chart Instances:');
  if (window.batteryFlexFundChartInstances) {
    console.log('Battery Flex Fund instances:', Object.keys(window.batteryFlexFundChartInstances));
  } else {
    console.log('❌ No batteryFlexFundChartInstances object');
  }

  // Check for any Chart.js errors
  console.log('\n5. All Chart.js Instances:');
  const allCharts = Chart.instances;
  console.log(`Total charts created: ${Object.keys(allCharts).length}`);
  Object.keys(allCharts).forEach(id => {
    const chart = allCharts[id];
    console.log(`  Chart ${id}: ${chart.canvas.id || 'no ID'}, Type: ${chart.config.type}`);
  });

  console.log('\n6. Section Visibility:');
  const sections = [
    '#energy-dashboard',
    '#battery-flex-fund',
    '#trading-simulator'
  ];
  sections.forEach(selector => {
    const section = document.querySelector(selector);
    if (section) {
      const style = window.getComputedStyle(section);
      console.log(`${selector}: display=${style.display}, visibility=${style.visibility}, opacity=${style.opacity}`);
    } else {
      console.log(`❌ ${selector}: NOT found`);
    }
  });

  console.log('\n====== END DIAGNOSTIC ======');
})();
