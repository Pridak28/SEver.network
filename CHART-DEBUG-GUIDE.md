# Chart Debugging Guide - Complete Instructions

## What I Just Fixed

### 1. Added Comprehensive Console Logging
- Script-2.js now logs every step of chart initialization
- Shows whether Chart.js is loaded
- Shows whether canvas elements are found
- Shows canvas and parent dimensions
- Shows if any errors occur during chart creation

### 2. Fixed Variable Scope Issues
- Chart variables (`energyProductionChart`, `networkActivityChart`) are now declared in outer scope
- This allows them to be accessed by refresh button and other functions

### 3. Added Error Handling
- Wrapped chart creation in try-catch blocks
- Errors will be logged to console with clear ❌ markers

### 4. Enhanced Force Canvas Size Script
- Now logs every operation to console
- Runs at multiple timepoints (immediate, 100ms, 500ms, 1000ms)
- Shows exactly how many canvases were found

### 5. Created Manual Fix Tool
- `manual-chart-fix.js` automatically runs 2 seconds after page load
- Can also be manually triggered by running `forceShowCharts()` in console

## How to Debug Charts Now

### Step 1: Open the Website
1. Open [index.html](index.html) in your browser
2. Open Developer Console (F12 or Cmd+Option+I on Mac)
3. Refresh the page

### Step 2: Check Console Logs

You should see messages like:

```
🔧 Force Canvas Size Script Loaded
🔧 DOM still loading, adding event listener
✅ Chart.js is loaded, version: 4.4.1
✅ energyProductionChart canvas found
Canvas dimensions: 800 x 300
Parent dimensions: 760 x 250
✅ Got 2D context for energyProductionChart
✅ energyProductionChart created successfully
✅ networkActivityChart canvas found
✅ networkActivityChart created successfully
🔧 Found 8 / 8 canvases
💡 Manual Chart Fix loaded. Run forceShowCharts() in console to manually trigger chart fixes.
```

### Step 3: Look for Errors

If you see ❌ messages, they will tell you exactly what's wrong:

- `❌ Chart.js is not loaded` - Chart.js CDN failed to load
- `❌ energyProductionChart canvas not found in DOM` - Canvas element missing from HTML
- `❌ Canvas has zero dimensions` - Parent container has no height
- `❌ Error creating energyProductionChart:` - Chart.js initialization error

### Step 4: Manual Fix

If charts still don't appear, run this in console:

```javascript
forceShowCharts()
```

This will:
1. Find all canvas elements
2. Force them and their parents to be visible
3. Set proper dimensions
4. Resize and update existing Chart.js instances

## Common Issues and Solutions

### Issue 1: Charts Not Found
**Console shows:** `❌ energyProductionChart canvas not found in DOM`

**Solution:**
- Canvas element doesn't exist in HTML
- Check if you're on the right page
- Canvas might have different ID

### Issue 2: Zero Dimensions
**Console shows:** `Canvas dimensions: 0 x 0` or `Parent dimensions: 0 x 0`

**Solution:**
- Parent container has `display: none` or `height: 0`
- Run `forceShowCharts()` in console
- Check CSS for conflicting rules

### Issue 3: Chart.js Not Loaded
**Console shows:** `❌ Chart.js is not loaded`

**Solution:**
- CDN is blocked or failed
- Check internet connection
- Check if ad blocker is blocking CDN
- Check browser console for network errors

### Issue 4: Chart.js Errors
**Console shows:** `❌ Error creating energyProductionChart: [error message]`

**Solution:**
- Look at the specific error message
- Usually means data format is wrong or options are invalid
- Check if canvas has proper context

## Test Files

### Simple Test Page
Open [simple-chart-test.html](simple-chart-test.html) to verify Chart.js works independently

This page has:
- 2 simple charts (line and bar)
- No complex styling
- No conflicting CSS
- Clear console logging

If charts show here but not on main page, the issue is CSS conflicts.

## Manual Console Commands

### Check if Chart.js is Loaded
```javascript
console.log(typeof Chart); // Should output "function"
console.log(Chart.version); // Should output version number
```

### Check Canvas Existence
```javascript
const canvas = document.getElementById('energyProductionChart');
console.log(canvas); // Should output canvas element
```

### Check Canvas Dimensions
```javascript
const canvas = document.getElementById('energyProductionChart');
console.log('Canvas:', canvas.width, 'x', canvas.height);
console.log('Parent:', canvas.parentElement.offsetWidth, 'x', canvas.parentElement.offsetHeight);
console.log('BoundingRect:', canvas.getBoundingClientRect());
```

### Check if Chart Instance Exists
```javascript
const canvas = document.getElementById('energyProductionChart');
const chartInstance = Chart.getChart(canvas);
console.log('Chart instance:', chartInstance);
```

### Force Chart Update
```javascript
const canvas = document.getElementById('energyProductionChart');
const chartInstance = Chart.getChart(canvas);
if (chartInstance) {
  chartInstance.resize();
  chartInstance.update();
  console.log('Chart updated');
}
```

### Force All Canvases Visible
```javascript
document.querySelectorAll('canvas').forEach(c => {
  c.style.display = 'block';
  c.style.visibility = 'visible';
  c.style.opacity = '1';
  const parent = c.parentElement;
  if (parent) {
    parent.style.minHeight = '300px';
    parent.style.display = 'block';
  }
  console.log('Fixed:', c.id);
});
```

## Files You Can Edit

### Visibility Rules
**File:** [visibility-fix.css](visibility-fix.css)

Contains all force-visibility rules for charts and containers

### Canvas Sizing
**File:** [force-canvas-size.js](force-canvas-size.js)

Programmatically sets canvas dimensions before Chart.js loads

### Chart Initialization
**File:** [script-2.js](script-2.js) (lines 1110-1350)

Where energyProductionChart and networkActivityChart are created

## What Console Output Means

| Symbol | Meaning |
|--------|---------|
| ✅ | Success - operation completed |
| ❌ | Error - something failed |
| ⚠️  | Warning - not critical but noteworthy |
| 🔧 | Debug info - diagnostic information |
| 📊 | Chart-related operation |
| 💡 | Tip or suggestion |

## Next Steps

1. **Refresh the page** with console open
2. **Read all console messages** - they tell you exactly what's happening
3. **Look for ❌ errors** - these show what's broken
4. **Run `forceShowCharts()`** if charts still invisible
5. **Send me the console output** if still not working - I can diagnose from the logs

## Expected Behavior

When everything works correctly:

1. Page loads
2. force-canvas-size.js runs multiple times, setting canvas dimensions
3. Chart.js loads
4. script-2.js runs, finds canvases, creates charts
5. Canvas visibility diagnostic runs, reports all charts visible
6. Manual chart fix runs 2 seconds later as final safety check
7. All charts display properly on page

If any step fails, you'll see clear error messages telling you which step and why.
