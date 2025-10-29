
document.addEventListener('DOMContentLoaded', () => {
  const slides = [...document.querySelectorAll('.slide')];
  let i = 0;
  function show(n){
    slides.forEach((s,idx)=> s.classList.toggle('active', idx===n));
  }
  show(i);
  setInterval(()=>{ i = (i+1) % slides.length; show(i); }, 5000);
});
