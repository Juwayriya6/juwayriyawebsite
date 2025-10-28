HOW TO CONVERT JPG -> WEBP (Terminal, macOS/Homebrew)
====================================================
1) Install the Google WebP tools:
   brew install webp

2) Put your original JPG here:
   assets/images/hero.jpg   (or change paths below)

3) Run these commands from your project folder:

   # Create 3 sizes (720, 960, 1200 on long edge) and convert to WebP
   cwebp -q 80 -resize 720 0  assets/images/hero.jpg -o assets/images/hero-720.webp
   cwebp -q 80 -resize 960 0  assets/images/hero.jpg -o assets/images/hero-960.webp
   cwebp -q 80 -resize 1200 0 assets/images/hero.jpg -o assets/images/hero-1200.webp

   # (Optional) if your image is portrait and you prefer setting height:
   # cwebp -q 80 -resize 0 960  assets/images/hero.jpg -o assets/images/hero-720.webp
   # cwebp -q 80 -resize 0 1280 assets/images/hero.jpg -o assets/images/hero-960.webp
   # cwebp -q 80 -resize 0 1600 assets/images/hero.jpg -o assets/images/hero-1200.webp

4) Reload your site. index.html already references:
   hero-720.webp, hero-960.webp, hero-1200.webp via srcset.

Advanced (ImageMagick alternative):
   brew install imagemagick
   magick assets/images/hero.jpg -resize 1200x1600 -strip -quality 82 assets/images/hero-1200.webp
   magick assets/images/hero.jpg -resize 960x1280  -strip -quality 80 assets/images/hero-960.webp
   magick assets/images/hero.jpg -resize 720x960   -strip -quality 78 assets/images/hero-720.webp

Tips:
- Start at -q 80; if gradients band, try -q 82 or add a tiny noise layer before export.
- Keep the composition within the central area; the card renders ~420px wide on desktop.
