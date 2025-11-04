#!/usr/bin/env node

/**
 * Mobile Conflicts Test Suite
 * Validates all mobile conflict fixes are properly implemented
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let passCount = 0;
let failCount = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function pass(message) {
  passCount++;
  log(`✓ ${message}`, 'green');
}

function fail(message) {
  failCount++;
  log(`✗ ${message}`, 'red');
}

function section(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(title, 'cyan');
  log('='.repeat(60), 'cyan');
}

// Test 1: Check for duplicate files
section('TEST 1: Duplicate File Check');
try {
  const duplicatePath = '/home/user/SEver.network/js/touch-interaction.js';
  if (!fs.existsSync(duplicatePath)) {
    pass('Duplicate touch-interaction.js removed from /js/ folder');
  } else {
    fail('Duplicate file still exists: js/touch-interaction.js');
  }
} catch (error) {
  fail(`Error checking duplicate file: ${error.message}`);
}

// Test 2: Check unified touch handler exists
section('TEST 2: Unified Touch Handler Validation');
try {
  const touchFile = fs.readFileSync('/home/user/SEver.network/touch-interaction.js', 'utf8');

  if (touchFile.includes('Unified mobile touch experience manager')) {
    pass('Unified touch handler comment found');
  } else {
    fail('Missing unified touch handler documentation');
  }

  if (touchFile.includes('clickableSelectors')) {
    pass('Centralized clickable selectors defined');
  } else {
    fail('Missing clickable selectors configuration');
  }

  if (touchFile.includes('visualFeedbackSelectors')) {
    pass('Visual feedback selectors defined');
  } else {
    fail('Missing visual feedback configuration');
  }

  if (touchFile.includes('dataset.touchHandled')) {
    pass('Duplicate handler prevention implemented');
  } else {
    fail('Missing duplicate handler prevention');
  }

  if (touchFile.includes('setTimeout') && touchFile.includes('100')) {
    pass('Visual feedback delay (100ms) implemented');
  } else {
    fail('Missing visual feedback delay');
  }
} catch (error) {
  fail(`Error reading touch-interaction.js: ${error.message}`);
}

// Test 3: Check for removed touch handlers in hero-script.js
section('TEST 3: Touch Handler Consolidation - hero-script.js');
try {
  const heroScript = fs.readFileSync('/home/user/SEver.network/hero-script.js', 'utf8');

  const touchEndCount = (heroScript.match(/addEventListener\s*\(\s*["']touchend["']/g) || []).length;

  if (touchEndCount === 0) {
    pass('All touchend handlers removed from hero-script.js');
  } else {
    fail(`Found ${touchEndCount} touchend handler(s) in hero-script.js`);
  }

  if (heroScript.includes('Touch events handled by touch-interaction.js')) {
    pass('Documentation comment added for unified handler');
  } else {
    fail('Missing documentation about unified touch handler');
  }
} catch (error) {
  fail(`Error reading hero-script.js: ${error.message}`);
}

// Test 4: Check for removed touch handlers in script-2.js
section('TEST 4: Touch Handler Consolidation - script-2.js');
try {
  const script2 = fs.readFileSync('/home/user/SEver.network/script-2.js', 'utf8');

  // Look for the specific removed touchend handlers
  if (!script2.includes('themeToggleBtn.addEventListener("touchend"')) {
    pass('Touchend handler removed from themeToggleBtn');
  } else {
    fail('Touchend handler still exists on themeToggleBtn');
  }

  if (!script2.includes('profileThemeToggleBtn.addEventListener("touchend"')) {
    pass('Touchend handler removed from profileThemeToggleBtn');
  } else {
    fail('Touchend handler still exists on profileThemeToggleBtn');
  }

  if (script2.includes('Touch events handled by touch-interaction.js')) {
    pass('Documentation comments added');
  } else {
    fail('Missing documentation comments');
  }
} catch (error) {
  fail(`Error reading script-2.js: ${error.message}`);
}

// Test 5: Breakpoint standardization to 768px
section('TEST 5: Breakpoint Standardization (768px)');
try {
  const script2 = fs.readFileSync('/home/user/SEver.network/script-2.js', 'utf8');

  if (script2.includes('window.innerWidth <= 768')) {
    pass('JavaScript breakpoint set to 768px in script-2.js');
  } else if (script2.includes('window.innerWidth <= 900')) {
    fail('Old 900px breakpoint still exists in script-2.js');
  } else {
    fail('Could not find breakpoint definition in script-2.js');
  }

  const mobileCss = fs.readFileSync('/home/user/SEver.network/css/mobile.css', 'utf8');

  const landscapeQuery = mobileCss.match(/@media.*landscape/i);
  if (landscapeQuery && landscapeQuery[0].includes('768px')) {
    pass('Landscape orientation query uses 768px');
  } else if (landscapeQuery && landscapeQuery[0].includes('900px')) {
    fail('Landscape orientation still uses 900px');
  } else {
    fail('Could not find landscape orientation query');
  }

  // Check style.css for proper documentation
  const styleCss = fs.readFileSync('/home/user/SEver.network/style.css', 'utf8');
  if (styleCss.includes('Primary breakpoint: 768px')) {
    pass('Breakpoint documentation added to style.css');
  } else {
    fail('Missing breakpoint documentation in style.css');
  }
} catch (error) {
  fail(`Error checking breakpoint standardization: ${error.message}`);
}

// Test 6: Inline styles moved from index.html
section('TEST 6: Inline Mobile Styles Removal');
try {
  const indexHtml = fs.readFileSync('/home/user/SEver.network/index.html', 'utf8');

  if (!indexHtml.includes('touch-action: manipulation')) {
    pass('touch-action rule removed from index.html');
  } else {
    fail('touch-action rule still in index.html');
  }

  if (!indexHtml.includes('@media (max-width: 768px)') ||
      indexHtml.includes('Mobile touch issues handled in css/mobile.css')) {
    pass('Mobile media query removed or documented in index.html');
  } else {
    fail('Mobile media query still active in index.html');
  }

  const mobileCss = fs.readFileSync('/home/user/SEver.network/css/mobile.css', 'utf8');

  if (mobileCss.includes('touch-action: manipulation')) {
    pass('touch-action rule added to mobile.css');
  } else {
    fail('touch-action rule missing from mobile.css');
  }

  if (mobileCss.includes('min-height: 44px') && mobileCss.includes('min-width: 44px')) {
    pass('Touch target sizes (44px) added to mobile.css');
  } else {
    fail('Touch target sizes missing from mobile.css');
  }
} catch (error) {
  fail(`Error checking inline styles: ${error.message}`);
}

// Test 7: Navigation CSS refactoring
section('TEST 7: Navigation CSS Simplification');
try {
  const styleCss = fs.readFileSync('/home/user/SEver.network/style.css', 'utf8');

  // Check hamburger-menu base styles
  const hamburgerMatch = styleCss.match(/\.hamburger-menu\s*{[^}]+}/);
  if (hamburgerMatch) {
    const hamburgerStyles = hamburgerMatch[0];

    // Should NOT have position, right, top, transform in base styles
    if (!hamburgerStyles.includes('position:') && !hamburgerStyles.includes('right:')) {
      pass('Hamburger menu base styles simplified (no positioning)');
    } else {
      fail('Hamburger menu still has positioning in base styles');
    }

    // Should NOT have duplicate display: none
    const displayCount = (hamburgerStyles.match(/display:\s*none/g) || []).length;
    if (displayCount <= 1) {
      pass('No duplicate display: none in hamburger-menu');
    } else {
      fail(`Found ${displayCount} duplicate display: none declarations`);
    }
  }

  const mobileCss = fs.readFileSync('/home/user/SEver.network/css/mobile.css', 'utf8');
  const mobileHamburger = mobileCss.match(/\.hamburger-menu\s*{[^}]+}/);

  if (mobileHamburger) {
    const mobileStyles = mobileHamburger[0];

    // Should NOT have right: auto, top: auto, transform: none (these were resets)
    if (!mobileStyles.includes('right: auto') && !mobileStyles.includes('top: auto')) {
      pass('Mobile hamburger styles cleaned (no reset properties)');
    } else {
      fail('Mobile hamburger still has reset properties');
    }
  }
} catch (error) {
  fail(`Error checking navigation CSS: ${error.message}`);
}

// Test 8: !important flags removal
section('TEST 8: !important Flag Removal');
try {
  const mobileCss = fs.readFileSync('/home/user/SEver.network/css/mobile.css', 'utf8');

  // Count !important in background opacity sections
  const backgroundSection = mobileCss.match(/TRANSPARENT BACKGROUNDS FOR ANIMATION[\s\S]*?@media/g);

  if (backgroundSection) {
    const importantCount = (backgroundSection[0].match(/!important/g) || []).length;

    if (importantCount === 0) {
      pass('All !important flags removed from background opacity rules');
    } else {
      fail(`Found ${importantCount} !important flag(s) in background opacity rules`);
    }
  }

  // Check landscape section
  const landscapeSection = mobileCss.match(/LANDSCAPE MOBILE ORIENTATION[\s\S]*$/);
  if (landscapeSection) {
    const landscapeImportant = (landscapeSection[0].match(/!important/g) || []).length;

    if (landscapeImportant === 0) {
      pass('All !important flags removed from landscape orientation rules');
    } else {
      fail(`Found ${landscapeImportant} !important flag(s) in landscape rules`);
    }
  }

  const styleCss = fs.readFileSync('/home/user/SEver.network/style.css', 'utf8');
  const roadmapMobile = styleCss.match(/Roadmap vertical line[\s\S]*?connector-dot\s*{[^}]+}/);

  if (roadmapMobile && !roadmapMobile[0].includes('!important')) {
    pass('!important flags removed from roadmap mobile styles');
  } else if (roadmapMobile) {
    fail('!important flags still exist in roadmap mobile styles');
  }
} catch (error) {
  fail(`Error checking !important flags: ${error.message}`);
}

// Test 9: Duplicate media query cleanup
section('TEST 9: Duplicate Media Query Consolidation');
try {
  const styleCss = fs.readFileSync('/home/user/SEver.network/style.css', 'utf8');

  // Check for duplicate html/body rules
  const mediaQueries768 = styleCss.match(/@media[^{]*max-width:\s*768px[^{]*{[\s\S]*?(?=@media|$)/g);

  if (mediaQueries768) {
    log(`Found ${mediaQueries768.length} media queries at 768px`, 'blue');

    // Check if html/body width rules are duplicated
    let htmlBodyCount = 0;
    mediaQueries768.forEach(query => {
      if (query.includes('html,') && query.includes('width: 100%') && query.includes('overflow-x: hidden')) {
        htmlBodyCount++;
      }
    });

    if (htmlBodyCount <= 1) {
      pass('No duplicate html/body width rules at 768px');
    } else {
      fail(`Found ${htmlBodyCount} duplicate html/body width rules`);
    }

    // Check for documentation comment about mobile.css
    if (styleCss.includes('css/mobile.css for navigation and touch styles') ||
        styleCss.includes('html/body rules handled in css/mobile.css')) {
      pass('Documentation added referencing mobile.css');
    } else {
      fail('Missing documentation about mobile.css separation');
    }
  }

  // Check that 900px media query is removed/replaced
  if (!styleCss.includes('@media (max-width: 900px)') ||
      !styleCss.includes('All navigation rules handled by mobile.css')) {
    pass('Empty 900px media query removed or updated');
  } else {
    fail('Empty 900px media query still exists');
  }
} catch (error) {
  fail(`Error checking duplicate media queries: ${error.message}`);
}

// Test 10: File structure validation
section('TEST 10: File Structure Validation');
try {
  const requiredFiles = [
    '/home/user/SEver.network/touch-interaction.js',
    '/home/user/SEver.network/css/mobile.css',
    '/home/user/SEver.network/style.css',
    '/home/user/SEver.network/hero-script.js',
    '/home/user/SEver.network/script-2.js',
    '/home/user/SEver.network/index.html'
  ];

  let allFilesExist = true;
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      fail(`Required file missing: ${file}`);
      allFilesExist = false;
    }
  });

  if (allFilesExist) {
    pass('All required files present');
  }

  // Verify js/ folder exists but doesn't contain touch-interaction.js
  if (fs.existsSync('/home/user/SEver.network/js')) {
    const jsFiles = fs.readdirSync('/home/user/SEver.network/js');
    if (!jsFiles.includes('touch-interaction.js')) {
      pass('js/ folder clean (no duplicate touch-interaction.js)');
    } else {
      fail('Duplicate file found in js/ folder');
    }
  }
} catch (error) {
  fail(`Error validating file structure: ${error.message}`);
}

// Summary
section('TEST SUMMARY');
const total = passCount + failCount;
const passRate = ((passCount / total) * 100).toFixed(1);

log(`\nTotal Tests: ${total}`, 'cyan');
log(`Passed: ${passCount}`, 'green');
log(`Failed: ${failCount}`, failCount > 0 ? 'red' : 'green');
log(`Pass Rate: ${passRate}%`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');

if (failCount === 0) {
  log('\n🎉 ALL TESTS PASSED! Mobile conflicts successfully resolved.', 'green');
  process.exit(0);
} else {
  log('\n⚠️  Some tests failed. Please review the errors above.', 'yellow');
  process.exit(1);
}
