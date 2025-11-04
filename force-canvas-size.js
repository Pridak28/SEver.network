/**
 * FORCE CANVAS SIZE INITIALIZATION
 * This ensures all canvas elements have proper dimensions before Chart.js initializes
 */

(function() {
  let runCount = 0;
  const MAX_RUNS = 3;

  function setCanvasDimensions() {
    runCount++;
    if (runCount > MAX_RUNS) return; // Prevent excessive runs

    const canvasIds = [
      "energyProductionChart",
      "networkActivityChart",
      "energyPriceChart",
      "consumptionBreakdownChart",
      "revenueChartCanvas",
      "frequencyChartCanvas",
      "marketPriceChartCanvas",
      "revenueAllocationChart"
    ];

    canvasIds.forEach(id => {
      const canvas = document.getElementById(id);
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      // Force parent to be visible and have dimensions
      parent.style.display = 'block';
      parent.style.visibility = 'visible';
      parent.style.minHeight = '300px';
      parent.style.minWidth = '100%';
      parent.style.position = 'relative';

      // Get parent dimensions
      const parentWidth = parent.clientWidth || parent.offsetWidth;
      const parentHeight = parent.clientHeight || parent.offsetHeight;

      // Set canvas dimensions
      const width = parentWidth > 0 ? parentWidth : 800;
      const height = parentHeight > 0 ? parentHeight : 300;

      canvas.width = width;
      canvas.height = height;
      canvas.style.display = 'block';
      canvas.style.visibility = 'visible';
      canvas.style.opacity = '1';
      canvas.style.minWidth = '300px';
      canvas.style.minHeight = '300px';
    });
  }

  // Run only once on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setCanvasDimensions);
  } else {
    setCanvasDimensions();
  }

  // Run once more after short delay
  setTimeout(setCanvasDimensions, 500);
})();
