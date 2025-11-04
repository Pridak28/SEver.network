/**
 * Chart Diagnostics Tool
 * Checks all chart canvases and reports which ones are missing initialization
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("=== CHART DIAGNOSTICS ===");

  // Wait for all scripts to load
  setTimeout(() => {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      console.error("❌ Chart.js is NOT loaded!");
      return;
    } else {
      console.log("✅ Chart.js is loaded (version:", Chart.version, ")");
    }

    // Find all canvas elements
    const allCanvases = document.querySelectorAll("canvas");
    console.log(`Found ${allCanvases.length} canvas elements`);

    allCanvases.forEach((canvas, index) => {
      const id = canvas.id || `canvas-${index}`;
      const parent = canvas.parentElement;
      const parentId = parent ? parent.id || parent.className : "unknown";

      console.log(`\n📊 Canvas #${index + 1}:`);
      console.log(`  ID: ${id}`);
      console.log(`  Parent: ${parentId}`);
      console.log(`  Dimensions: ${canvas.width}x${canvas.height}`);

      // Check if canvas has been drawn on
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasContent = imageData.data.some(pixel => pixel !== 0);

      if (hasContent) {
        console.log(`  Status: ✅ HAS CONTENT`);
      } else {
        console.log(`  Status: ⚠️  EMPTY (may not be initialized)`);
      }
    });

    // List all Chart instances
    console.log("\n=== Active Chart.js Instances ===");
    Object.keys(window).forEach(key => {
      if (window[key] instanceof Chart) {
        console.log(`✅ ${key}:`, window[key].config.type);
      }
    });

    console.log("\n=== END DIAGNOSTICS ===\n");
  }, 3000); // Wait 3 seconds for all charts to initialize
});
