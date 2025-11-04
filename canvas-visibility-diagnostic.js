/**
 * CANVAS VISIBILITY DIAGNOSTIC TOOL
 * This script checks if all canvas elements are visible and have proper dimensions
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("=== CANVAS VISIBILITY DIAGNOSTIC ===");

  // Wait a bit for CSS to load
  setTimeout(() => {
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

      if (!canvas) {
        console.error(`❌ Canvas NOT FOUND: ${id}`);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const computed = window.getComputedStyle(canvas);
      const parent = canvas.parentElement;
      const parentComputed = parent ? window.getComputedStyle(parent) : null;

      console.log(`\n📊 Canvas: ${id}`);
      console.log(`  Canvas dimensions: ${canvas.width} x ${canvas.height}`);
      console.log(`  BoundingRect: ${rect.width.toFixed(2)} x ${rect.height.toFixed(2)}`);
      console.log(`  Display: ${computed.display}`);
      console.log(`  Visibility: ${computed.visibility}`);
      console.log(`  Opacity: ${computed.opacity}`);
      console.log(`  Position: ${computed.position}`);
      console.log(`  Z-index: ${computed.zIndex}`);

      if (parent) {
        console.log(`  Parent class: ${parent.className}`);
        console.log(`  Parent display: ${parentComputed.display}`);
        console.log(`  Parent dimensions: ${parent.offsetWidth} x ${parent.offsetHeight}`);
        console.log(`  Parent visibility: ${parentComputed.visibility}`);
      }

      // Check if actually visible
      if (rect.width === 0 || rect.height === 0) {
        console.warn(`  ⚠️  INVISIBLE: Canvas has zero dimensions!`);
      } else if (computed.display === 'none') {
        console.warn(`  ⚠️  HIDDEN: Canvas has display:none`);
      } else if (computed.visibility === 'hidden') {
        console.warn(`  ⚠️  HIDDEN: Canvas has visibility:hidden`);
      } else if (computed.opacity === '0') {
        console.warn(`  ⚠️  INVISIBLE: Canvas has opacity:0`);
      } else {
        console.log(`  ✅ VISIBLE`);
      }
    });

    console.log("\n=== END DIAGNOSTIC ===");
  }, 500);
});
