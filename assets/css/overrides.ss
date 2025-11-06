/* Kill the spinner/overlay even if main.js fails */
body:before,
body:after {
  animation: none !important;
  display: none !important;
}

/* Mobile slideshow behavior and nav dots placement */
@media (max-width: 1000px) {
  #intro .slide { background-attachment: scroll !important; }
  #intro .slideshowNav {
    position: absolute;
    top: 20px;
    left: 50%;
    right: auto;
    bottom: auto;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    flex-direction: row;
  }
  #intro .navDot { width: 14px; height: 14px; }
}