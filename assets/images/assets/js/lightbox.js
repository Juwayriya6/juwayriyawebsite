
(function(){
  const lb = document.querySelector('.lightbox');
  const img = lb.querySelector('.lightbox__img');
  const closeBtn = lb.querySelector('.lb-close');
  const prevBtn = lb.querySelector('.lb-prev');
  const nextBtn = lb.querySelector('.lb-next');
  const thumbs = [...document.querySelectorAll('[data-lb]')];
  let idx = 0;

  function open(n){
    idx = n;
    img.src = thumbs[idx].getAttribute('data-lb');
    lb.classList.add('open');
  }
  function close(){ lb.classList.remove('open'); }
  function prev(){ idx = (idx - 1 + thumbs.length) % thumbs.length; img.src = thumbs[idx].getAttribute('data-lb'); }
  function next(){ idx = (idx + 1) % thumbs.length; img.src = thumbs[idx].getAttribute('data-lb'); }

  thumbs.forEach((t, n)=> t.addEventListener('click', e => { e.preventDefault(); open(n); }));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  window.addEventListener('keydown', e=>{
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') prev();
    if(e.key==='ArrowRight') next();
  });
})();
