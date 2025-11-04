/**
 * MOBILE DIAGNOSTIC TEST
 * Run this on mobile to check what's working
 */

(function() {
    console.log('==================================');
    console.log('📱 MOBILE DIAGNOSTIC TEST');
    console.log('==================================');

    // Wait for page to load
    setTimeout(function() {

        // Test 1: Check if mobile detected
        const isMobile = window.innerWidth <= 768;
        console.log('1. Mobile detected:', isMobile ? '✅ YES' : '❌ NO');
        console.log('   Screen width:', window.innerWidth);

        // Test 2: Check hamburger button
        const hamburger = document.getElementById('hamburgerMenu') || document.querySelector('.hamburger-menu');
        console.log('2. Hamburger button:', hamburger ? '✅ FOUND' : '❌ MISSING');
        if (hamburger) {
            const style = window.getComputedStyle(hamburger);
            console.log('   Display:', style.display);
            console.log('   Visibility:', style.visibility);
            console.log('   Position:', style.position);
        }

        // Test 3: Check nav menu
        const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
        console.log('3. Nav menu:', navMenu ? '✅ FOUND' : '❌ MISSING');
        if (navMenu) {
            const style = window.getComputedStyle(navMenu);
            console.log('   Display:', style.display);
            console.log('   Has "active" class:', navMenu.classList.contains('active') ? 'YES' : 'NO');
        }

        // Test 4: Check theme toggle
        const themeToggle = document.getElementById('heroThemeToggle') || document.querySelector('.hero-theme-toggle');
        console.log('4. Theme toggle:', themeToggle ? '✅ FOUND' : '❌ MISSING');
        if (themeToggle) {
            const style = window.getComputedStyle(themeToggle);
            console.log('   Display:', style.display);
            console.log('   Width:', style.width);
            console.log('   Height:', style.height);
            console.log('   Background:', style.background);
        }

        // Test 5: Check CSS loaded
        const stylesheets = Array.from(document.styleSheets);
        const mobileCSS = stylesheets.find(s => s.href && s.href.includes('mobile.css'));
        console.log('5. Mobile CSS loaded:', mobileCSS ? '✅ YES' : '❌ NO');

        // Test 6: Check animation
        const body = document.body;
        const bodyStyle = window.getComputedStyle(body);
        console.log('6. Body animation:', bodyStyle.animation || bodyStyle.webkitAnimation || '❌ NONE');

        // Test 7: Check CSS variables
        const root = document.documentElement;
        const accentColor = getComputedStyle(root).getPropertyValue('--accent-color');
        console.log('7. Accent color variable:', accentColor ? '✅ ' + accentColor.trim() : '❌ NOT SET');

        // Test 8: Check for conflicts
        const allStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
        console.log('8. Total stylesheets loaded:', allStyles.length);

        console.log('==================================');
        console.log('📋 SUMMARY:');
        console.log('If you see ❌ above, that element is MISSING or BROKEN');
        console.log('Send me this console output!');
        console.log('==================================');

        // Add visual indicator on page
        if (isMobile) {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #00ffff;
                color: #000;
                padding: 15px;
                border-radius: 10px;
                font-size: 12px;
                z-index: 99999;
                max-width: 200px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            `;

            const issues = [];
            if (!hamburger) issues.push('❌ Hamburger missing');
            if (!navMenu) issues.push('❌ Menu missing');
            if (!themeToggle) issues.push('❌ Toggle missing');
            if (!mobileCSS) issues.push('❌ CSS not loaded');

            if (issues.length > 0) {
                indicator.innerHTML = '<strong>ISSUES FOUND:</strong><br>' + issues.join('<br>');
            } else {
                indicator.innerHTML = '✅ All elements found!<br>Check console for details';
            }

            document.body.appendChild(indicator);

            // Remove after 10 seconds
            setTimeout(() => indicator.remove(), 10000);
        }

    }, 2000); // Wait 2 seconds for everything to load
})();
