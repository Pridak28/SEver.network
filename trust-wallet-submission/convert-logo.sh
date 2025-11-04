#!/bin/bash

# SEVER Token Logo Converter
# Converts logo.svg to logo.png at 256x256 pixels

echo "🎨 SEVER Token Logo Converter"
echo "================================"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found!"
    echo ""
    echo "Please install it first:"
    echo "  macOS:  brew install imagemagick"
    echo "  Linux:  sudo apt-get install imagemagick"
    echo ""
    echo "OR use online converter:"
    echo "  https://svgtopng.com"
    echo ""
    exit 1
fi

# Check if logo.svg exists
if [ ! -f "logo.svg" ]; then
    echo "❌ logo.svg not found!"
    echo "Make sure you're in the trust-wallet-submission folder"
    exit 1
fi

echo "Converting logo.svg to logo.png..."
convert logo.svg -resize 256x256 -background none logo.png

if [ -f "logo.png" ]; then
    FILE_SIZE=$(stat -f%z logo.png 2>/dev/null || stat -c%s logo.png 2>/dev/null)
    FILE_SIZE_KB=$((FILE_SIZE / 1024))

    echo "✅ Success!"
    echo ""
    echo "📊 File Details:"
    echo "   Size: ${FILE_SIZE_KB}KB"

    if [ $FILE_SIZE_KB -gt 100 ]; then
        echo "   ⚠️  WARNING: File is larger than 100KB!"
        echo "   You may need to optimize it at: https://tinypng.com"
    else
        echo "   ✅ File size is good (under 100KB)"
    fi

    echo ""
    echo "🎉 logo.png is ready for submission!"
    echo ""
    echo "Next steps:"
    echo "1. Read SUBMISSION-GUIDE.md"
    echo "2. Fork https://github.com/trustwallet/assets"
    echo "3. Upload logo.png and info.json"
    echo ""
else
    echo "❌ Conversion failed!"
    echo "Try using an online converter instead:"
    echo "https://svgtopng.com"
fi