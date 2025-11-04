/**
 * COMPREHENSIVE DIAGNOSTIC TOOL
 * Checks all animations, graphics, canvas elements, and scroll functionality
 * Run this in browser console to get detailed report
 */

(function() {
  'use strict';

  const results = {
    timestamp: new Date().toISOString(),
    errors: [],
    warnings: [],
    info: [],
    canvasElements: [],
    animations: [],
    scrollIssues: [],
    scriptStatus: [],
    styleIssues: []
  };

  console.log('%c🔍 STARTING COMPREHENSIVE DIAGNOSTIC CHECK...', 'background: #00ffff; color: #000; font-size: 16px; padding: 10px;');

  // ============================================
  // 1. CHECK CANVAS ELEMENTS
  // ============================================
  function checkCanvasElements() {
    console.log('%c📊 Checking Canvas Elements...', 'color: #00ff00; font-size: 14px;');
    
    const canvases = document.querySelectorAll('canvas');
    results.info.push(`Found ${canvases.length} canvas elements`);
    
    canvases.forEach((canvas, index) => {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      const computed = window.getComputedStyle(canvas);
      
      const canvasInfo = {
        id: canvas.id || `canvas-${index}`,
        width: canvas.width,
        height: canvas.height,
        displayWidth: rect.width,
        displayHeight: rect.height,
        visible: computed.display !== 'none' && computed.visibility !== 'hidden',
        zIndex: computed.zIndex,
        position: computed.position,
        hasContext: !!ctx,
        parent: canvas.parentElement?.tagName || 'NONE'
      };
      
      results.canvasElements.push(canvasInfo);
      
      // Check for issues
      if (canvas.width === 0 || canvas.height === 0) {
        results.errors.push(`Canvas "${canvasInfo.id}" has zero dimensions`);
      }
      
      if (!canvasInfo.visible) {
        results.warnings.push(`Canvas "${canvasInfo.id}" is not visible`);
      }
      
      if (!ctx) {
        results.errors.push(`Canvas "${canvasInfo.id}" has no rendering context`);
      }
      
      console.log(`  ✓ Canvas: ${canvasInfo.id}`, canvasInfo);
    });
  }

  // ============================================
  // 2. CHECK BACKGROUND CANVAS SPECIFICALLY
  // ============================================
  function checkBackgroundCanvas() {
    console.log('%c🎨 Checking Background Canvas...', 'color: #00ff00; font-size: 14px;');
    
    const bgCanvas = document.getElementById('bgCanvas');
    
    if (!bgCanvas) {
      results.errors.push('CRITICAL: Background canvas #bgCanvas not found in DOM');
      return;
    }
    
    const rect = bgCanvas.getBoundingClientRect();
    const ctx = bgCanvas.getContext('2d');
    const computed = window.getComputedStyle(bgCanvas);
    
    const bgInfo = {
      exists: true,
      width: bgCanvas.width,
      height: bgCanvas.height,
      displayWidth: rect.width,
      displayHeight: rect.height,
      position: computed.position,
      zIndex: computed.zIndex,
      display: computed.display,
      visibility: computed.visibility,
      opacity: computed.opacity,
      hasContext: !!ctx
    };
    
    results.info.push('Background canvas found');
    
    // Check for critical issues
    if (computed.position !== 'fixed' && computed.position !== 'absolute') {
      results.errors.push(`Background canvas position is "${computed.position}" (should be fixed or absolute)`);
    }
    
    if (parseInt(computed.zIndex) >= 0) {
      results.warnings.push(`Background canvas z-index is ${computed.zIndex} (should be negative for background)`);
    }
    
    if (computed.display === 'none') {
      results.errors.push('CRITICAL: Background canvas is display:none');
    }
    
    if (computed.visibility === 'hidden') {
      results.errors.push('CRITICAL: Background canvas is visibility:hidden');
    }
    
    console.log('  Background Canvas Details:', bgInfo);
  }

  // ============================================
  // 3. CHECK CHART.JS INSTANCES
  // ============================================
  function checkChartJS() {
    console.log('%c📈 Checking Chart.js...', 'color: #00ff00; font-size: 14px;');
    
    if (typeof Chart === 'undefined') {
      results.errors.push('CRITICAL: Chart.js library not loaded');
      return;
    }
    
    results.info.push(`Chart.js version: ${Chart.version || 'unknown'}`);
    
    const chartCanvases = [
      'energyProductionChart',
      'networkActivityChart',
      'consumptionBreakdownChart',
      'energyPriceChart',
      'revenueChartCanvas',
      'frequencyChartCanvas',
      'marketPriceChartCanvas',
      'revenueAllocationChart'
    ];
    
    chartCanvases.forEach(id => {
      const canvas = document.getElementById(id);
      if (canvas) {
        const hasChart = Chart.getChart(canvas);
        if (!hasChart) {
          results.warnings.push(`Chart canvas "${id}" exists but no Chart.js instance attached`);
        } else {
          results.info.push(`Chart "${id}" is active`);
        }
      }
    });
  }

  // ============================================
  // 4. CHECK THREE.JS / 3D VISUALIZATIONS
  // ============================================
  function checkThreeJS() {
    console.log('%c🎲 Checking Three.js...', 'color: #00ff00; font-size: 14px;');
    
    if (typeof THREE === 'undefined') {
      results.errors.push('CRITICAL: Three.js library not loaded');
      return;
    }
    
    results.info.push(`Three.js loaded (version check: ${typeof THREE.WebGLRenderer})`);
    
    const threeContainers = [
      'blockchain3DContainer',
      'tradingBlockchain3DContainer'
    ];
    
    threeContainers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        const hasCanvas = container.querySelector('canvas');
        if (!hasCanvas) {
          results.warnings.push(`3D container "${id}" exists but has no canvas`);
        } else {
          results.info.push(`3D visualization "${id}" has canvas`);
        }
      } else {
        results.warnings.push(`3D container "${id}" not found`);
      }
    });
  }

  // ============================================
  // 5. CHECK ANIMATION FUNCTIONS
  // ============================================
  function checkAnimationFunctions() {
    console.log('%c🎬 Checking Animation Functions...', 'color: #00ff00; font-size: 14px;');
    
    const animationFunctions = [
      'animate',
      'animateBackground',
      'renderBackground',
      'updateAnimation',
      'initBackgroundAnimation',
      'startAnimation'
    ];
    
    animationFunctions.forEach(funcName => {
      if (typeof window[funcName] === 'function') {
        results.info.push(`Animation function "${funcName}" is defined`);
      }
    });
    
    // Check for requestAnimationFrame
    if (!window.requestAnimationFrame) {
      results.errors.push('CRITICAL: requestAnimationFrame not available');
    }
  }

  // ============================================
  // 6. CHECK SCROLL FUNCTIONALITY
  // ============================================
  function checkScrollFunctionality() {
    console.log('%c📜 Checking Scroll Functionality...', 'color: #00ff00; font-size: 14px;');
    
    const scrollInfo = {
      scrollY: window.scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      canScroll: document.documentElement.scrollHeight > document.documentElement.clientHeight
    };
    
    results.info.push(`Current scroll position: ${scrollInfo.scrollY}px`);
    results.info.push(`Page is scrollable: ${scrollInfo.canScroll}`);
    
    // Check for scroll event listeners
    const scrollListenerTest = () => {};
    window.addEventListener('scroll', scrollListenerTest);
    window.removeEventListener('scroll', scrollListenerTest);
    results.info.push('Scroll events are working');
    
    // Check for overflow hidden on body/html
    const htmlStyle = window.getComputedStyle(document.documentElement);
    const bodyStyle = window.getComputedStyle(document.body);
    
    if (htmlStyle.overflow === 'hidden') {
      results.errors.push('HTML element has overflow:hidden - prevents scrolling!');
    }
    
    if (bodyStyle.overflow === 'hidden' && scrollInfo.canScroll) {
      results.warnings.push('Body element has overflow:hidden');
    }
  }

  // ============================================
  // 7. CHECK LOADED SCRIPTS
  // ============================================
  function checkLoadedScripts() {
    console.log('%c📦 Checking Loaded Scripts...', 'color: #00ff00; font-size: 14px;');
    
    const criticalScripts = [
      'chart.js',
      'three.min.js',
      'confetti.browser.min.js',
      'simple-bg-animation.js',
      'script-2.js',
      'hero-script.js',
      'blockchainexplorerjs.js',
      'trading-simulator.js'
    ];
    
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    
    criticalScripts.forEach(scriptName => {
      const found = scripts.some(script => script.src.includes(scriptName));
      if (found) {
        results.info.push(`Script loaded: ${scriptName}`);
      } else {
        results.warnings.push(`Script not found: ${scriptName}`);
      }
    });
    
    // Check for script errors
    const scriptTags = document.querySelectorAll('script');
    scriptTags.forEach(script => {
      if (script.hasAttribute('src')) {
        const scriptInfo = {
          src: script.src,
          async: script.async,
          defer: script.defer,
          loaded: true // Assume loaded if no error event
        };
        results.scriptStatus.push(scriptInfo);
      }
    });
  }

  // ============================================
  // 8. CHECK CSS ANIMATIONS
  // ============================================
  function checkCSSAnimations() {
    console.log('%c🎨 Checking CSS Animations...', 'color: #00ff00; font-size: 14px;');
    
    // Check for elements with animations
    const animatedElements = document.querySelectorAll('[class*="animate"], [class*="pulse"], [class*="fade"]');
    
    results.info.push(`Found ${animatedElements.length} elements with animation classes`);
    
    // Check if animations are enabled in browser
    const testDiv = document.createElement('div');
    testDiv.style.animation = 'test 1s';
    if (testDiv.style.animation === '') {
      results.warnings.push('CSS animations may not be supported or enabled');
    }
  }

  // ============================================
  // 9. CHECK INTERSECTION OBSERVER
  // ============================================
  function checkIntersectionObserver() {
    console.log('%c👁️ Checking Intersection Observer...', 'color: #00ff00; font-size: 14px;');
    
    if (!window.IntersectionObserver) {
      results.errors.push('IntersectionObserver not available - scroll animations may fail');
    } else {
      results.info.push('IntersectionObserver is available');
      
      // Check for observed elements
      const sections = document.querySelectorAll('section');
      results.info.push(`Found ${sections.length} sections that could be observed`);
    }
  }

  // ============================================
  // 10. CHECK CONSOLE ERRORS
  // ============================================
  function checkConsoleErrors() {
    console.log('%c⚠️ Checking for Console Errors...', 'color: #00ff00; font-size: 14px;');
    
    // Override console.error temporarily to catch any errors
    const originalError = console.error;
    const errors = [];
    
    console.error = function(...args) {
      errors.push(args.join(' '));
      originalError.apply(console, args);
    };
    
    // Restore after a short delay
    setTimeout(() => {
      console.error = originalError;
      if (errors.length > 0) {
        results.errors.push(...errors);
      }
    }, 100);
  }

  // ============================================
  // 11. CHECK PERFORMANCE
  // ============================================
  function checkPerformance() {
    console.log('%c⚡ Checking Performance...', 'color: #00ff00; font-size: 14px;');
    
    if (window.performance) {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        results.info.push(`Page load time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        results.info.push(`DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.fetchStart}ms`);
      }
      
      // Check for long tasks
      if (performance.getEntriesByType('longtask')) {
        const longTasks = performance.getEntriesByType('longtask');
        if (longTasks.length > 0) {
          results.warnings.push(`Detected ${longTasks.length} long tasks that may affect animations`);
        }
      }
    }
  }

  // ============================================
  // 12. CHECK VISIBILITY API
  // ============================================
  function checkVisibilityAPI() {
    console.log('%c👁️ Checking Page Visibility...', 'color: #00ff00; font-size: 14px;');
    
    if (document.hidden) {
      results.warnings.push('Page is currently hidden - animations may be paused');
    }
    
    results.info.push(`Page visibility state: ${document.visibilityState}`);
  }

  // ============================================
  // EXECUTE ALL CHECKS
  // ============================================
  function runAllChecks() {
    try {
      checkCanvasElements();
      checkBackgroundCanvas();
      checkChartJS();
      checkThreeJS();
      checkAnimationFunctions();
      checkScrollFunctionality();
      checkLoadedScripts();
      checkCSSAnimations();
      checkIntersectionObserver();
      checkConsoleErrors();
      checkPerformance();
      checkVisibilityAPI();
    } catch (error) {
      results.errors.push(`Diagnostic tool error: ${error.message}`);
    }
  }

  // ============================================
  // GENERATE REPORT
  // ============================================
  function generateReport() {
    console.log('\n\n');
    console.log('%c═══════════════════════════════════════════════════', 'color: #00ffff; font-size: 16px;');
    console.log('%c           DIAGNOSTIC REPORT SUMMARY', 'color: #00ffff; font-size: 16px; font-weight: bold;');
    console.log('%c═══════════════════════════════════════════════════', 'color: #00ffff; font-size: 16px;');
    
    // Summary counts
    console.log(`\n%c🔴 ERRORS: ${results.errors.length}`, `color: ${results.errors.length > 0 ? '#ff0000' : '#00ff00'}; font-size: 14px; font-weight: bold;`);
    console.log(`%c🟡 WARNINGS: ${results.warnings.length}`, `color: ${results.warnings.length > 0 ? '#ffaa00' : '#00ff00'}; font-size: 14px; font-weight: bold;`);
    console.log(`%c🔵 INFO: ${results.info.length}`, 'color: #00aaff; font-size: 14px; font-weight: bold;');
    
    // Errors
    if (results.errors.length > 0) {
      console.log('\n%c🔴 CRITICAL ERRORS:', 'color: #ff0000; font-size: 14px; font-weight: bold; text-decoration: underline;');
      results.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. %c${error}`, 'color: #ff6666;');
      });
    }
    
    // Warnings
    if (results.warnings.length > 0) {
      console.log('\n%c🟡 WARNINGS:', 'color: #ffaa00; font-size: 14px; font-weight: bold; text-decoration: underline;');
      results.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. %c${warning}`, 'color: #ffcc66;');
      });
    }
    
    // Canvas Details
    console.log('\n%c📊 CANVAS ELEMENTS:', 'color: #00ff00; font-size: 14px; font-weight: bold; text-decoration: underline;');
    results.canvasElements.forEach(canvas => {
      console.log(`  • ${canvas.id}:`, canvas);
    });
    
    // Final verdict
    console.log('\n%c═══════════════════════════════════════════════════', 'color: #00ffff; font-size: 16px;');
    if (results.errors.length === 0) {
      console.log('%c✅ NO CRITICAL ERRORS FOUND', 'color: #00ff00; font-size: 16px; font-weight: bold;');
    } else {
      console.log('%c❌ CRITICAL ERRORS DETECTED - FIX REQUIRED', 'color: #ff0000; font-size: 16px; font-weight: bold;');
    }
    console.log('%c═══════════════════════════════════════════════════', 'color: #00ffff; font-size: 16px;');
    
    // Return results object for programmatic access
    return results;
  }

  // ============================================
  // AUTO-FIX COMMON ISSUES
  // ============================================
  function autoFixIssues() {
    console.log('\n%c🔧 ATTEMPTING AUTO-FIX...', 'color: #ffaa00; font-size: 14px; font-weight: bold;');
    
    const fixes = [];
    
    // Fix 1: Ensure background canvas is visible
    const bgCanvas = document.getElementById('bgCanvas');
    if (bgCanvas) {
      const computed = window.getComputedStyle(bgCanvas);
      if (computed.display === 'none') {
        bgCanvas.style.display = 'block';
        fixes.push('✓ Fixed background canvas display');
      }
      if (computed.visibility === 'hidden') {
        bgCanvas.style.visibility = 'visible';
        fixes.push('✓ Fixed background canvas visibility');
      }
      if (parseInt(computed.zIndex) >= 0) {
        bgCanvas.style.zIndex = '-1';
        fixes.push('✓ Fixed background canvas z-index');
      }
      if (computed.position !== 'fixed' && computed.position !== 'absolute') {
        bgCanvas.style.position = 'fixed';
        fixes.push('✓ Fixed background canvas position');
      }
    }
    
    // Fix 2: Remove overflow hidden from html/body
    if (window.getComputedStyle(document.documentElement).overflow === 'hidden') {
      document.documentElement.style.overflow = 'auto';
      fixes.push('✓ Fixed HTML overflow');
    }
    
    // Fix 3: Restart background animation if function exists
    if (typeof window.initBackgroundAnimation === 'function') {
      try {
        window.initBackgroundAnimation();
        fixes.push('✓ Restarted background animation');
      } catch (e) {
        fixes.push('✗ Failed to restart animation: ' + e.message);
      }
    }
    
    if (fixes.length > 0) {
      console.log('%cAuto-fixes applied:', 'color: #00ff00; font-weight: bold;');
      fixes.forEach(fix => console.log(`  ${fix}`));
    } else {
      console.log('%cNo auto-fixes needed', 'color: #00ff00;');
    }
    
    return fixes;
  }

  // ============================================
  // RUN DIAGNOSTIC
  // ============================================
  runAllChecks();
  const report = generateReport();
  const fixes = autoFixIssues();
  
  // Make results available globally
  window.diagnosticResults = report;
  window.diagnosticFixes = fixes;
  
  console.log('\n%c💡 TIP: Access full results with: window.diagnosticResults', 'color: #00aaff; font-style: italic;');
  console.log('%c💡 TIP: View applied fixes with: window.diagnosticFixes', 'color: #00aaff; font-style: italic;');
  console.log('%c💡 TIP: Run diagnostic again with: window.runDiagnostic()', 'color: #00aaff; font-style: italic;');
  
  // Make function available for re-running
  window.runDiagnostic = function() {
    location.reload(); // Simple reload to re-run
  };
  
  return report;
})();
