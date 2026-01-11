#!/bin/bash

# Image Optimization Script for Jumplings
# Requires: imagemagick (brew install imagemagick)

echo "🖼️  Optimizing images in public/images/"

# Check if imagemagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not installed!"
    echo "Install with: brew install imagemagick"
    exit 1
fi

# Create backup
echo "📦 Creating backup..."
cp -r public/images public/images_backup_$(date +%Y%m%d_%H%M%S)

# Count files
TOTAL=$(find public/images -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | wc -l)
echo "Found $TOTAL images to optimize"

CURRENT=0

# Optimize PNGs
echo "🔧 Optimizing PNG files..."
find public/images -type f -name "*.png" | while read file; do
    CURRENT=$((CURRENT + 1))
    echo "[$CURRENT/$TOTAL] Optimizing: $(basename "$file")"
    
    # Get original size
    ORIGINAL_SIZE=$(du -h "$file" | cut -f1)
    
    # Optimize: resize if > 1200px width, reduce quality, strip metadata
    convert "$file" \
        -resize '1200x>' \
        -strip \
        -quality 85 \
        "$file.tmp.png"
    
    # Replace original
    mv "$file.tmp.png" "$file"
    
    # Get new size
    NEW_SIZE=$(du -h "$file" | cut -f1)
    echo "   $ORIGINAL_SIZE → $NEW_SIZE"
done

# Optimize JPGs
echo "🔧 Optimizing JPG files..."
find public/images -type f \( -name "*.jpg" -o -name "*.jpeg" \) | while read file; do
    CURRENT=$((CURRENT + 1))
    echo "[$CURRENT/$TOTAL] Optimizing: $(basename "$file")"
    
    ORIGINAL_SIZE=$(du -h "$file" | cut -f1)
    
    # Optimize: resize if > 1200px width, reduce quality, strip metadata
    convert "$file" \
        -resize '1200x>' \
        -strip \
        -sampling-factor 4:2:0 \
        -quality 85 \
        "$file.tmp.jpg"
    
    mv "$file.tmp.jpg" "$file"
    
    NEW_SIZE=$(du -h "$file" | cut -f1)
    echo "   $ORIGINAL_SIZE → $NEW_SIZE"
done

# Show final stats
BEFORE=$(du -sh public/images_backup_* | tail -1 | cut -f1)
AFTER=$(du -sh public/images | cut -f1)

echo ""
echo "✅  Optimization complete!"
echo "   Before: $BEFORE"
echo "   After:  $AFTER"
echo ""
echo "💡 Backup saved in: public/images_backup_*"
echo "💡 If something broke, restore with: rm -rf public/images && mv public/images_backup_* public/images"
