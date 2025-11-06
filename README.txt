This ZIP contains a minimal patch to make your slideshow visible and working:

Included files:
- index.html  (head links and cleaned slides: only one '.active')
- assets/css/slideshow.css  (z-index and layout fixes so slides aren't hidden)
- assets/js/slideshow.js    (loads optimized WebP backgrounds and rotates slides)

How to apply:
1) Unzip.
2) Copy the three files into your project, preserving paths (assets/css and assets/js).
   If you prefer, open your files and paste in the changes instead.
3) Make sure your optimized WebP files exist in images/slideshow/optimized/ with names like
   <stem>-720.webp, <stem>-960.webp, <stem>-1200.webp.
4) Deploy and test.

Notes:
- Do not leave two slides with the 'active' class. Only the first one should be active.
- We reference your original JPG names in the HTML, but the JS swaps to their optimized WebP
  variants automatically based on screen width.
