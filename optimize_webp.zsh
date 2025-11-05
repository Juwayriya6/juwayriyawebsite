#!/usr/bin/env zsh
set -e
setopt NULL_GLOB

# Make output folder
mkdir -p images/slideshow/optimized

# Convert every PNG/JPG/JPEG in images/slideshow
for f in images/slideshow/*.(png|jpg|jpeg); do
  stem="${f:t:r}"   # filename without path/ext (zsh modifier)
  for w in 720 960 1200; do
    sips -Z $w "$f" --out "images/slideshow/optimized/${stem}-${w}.jpg" >/dev/null
    cwebp -quiet -q 76 "images/slideshow/optimized/${stem}-${w}.jpg" \
      -o "images/slideshow/optimized/${stem}-${w}.webp" >/dev/null
  done
done

# Remove the temporary JPGs; keep WebP
rm -f images/slideshow/optimized/*.jpg

# Show results
ls -lh images/slideshow/optimized
