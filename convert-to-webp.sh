#!/bin/bash

# WebP Conversion Script
# Uses 'magick' (ImageMagick v7) to convert PNGs/JPGs to WebP

echo "🖼️  Converting images to WebP..."

# Find all Sea Urchin PNGs
find public/images -name "*sea_urchin*.png" | while read file; do
    filename=$(basename "$file")
    name="${filename%.*}"
    dir=$(dirname "$file")
    webp_file="$dir/$name.webp"
    
    echo "Converting $filename to WebP..."
    
    # Convert to WebP
    # -quality 80: Good balance
    # -define webp:lossless=false: Ensure lossy compression for photos (PNGs often hold photo data)
    magick "$file" -quality 80 -define webp:lossless=false "$webp_file"
    
    # Stats
    orig_size=$(du -h "$file" | cut -f1)
    new_size=$(du -h "$webp_file" | cut -f1)
    echo "  $orig_size -> $new_size"
done

echo "✅ WebP conversion complete!"
