/* ========== UTIL: smooth scroll on menu click ========== */
function scrollToId(id){
  if(id === 'contact'){
    document.querySelector('footer').scrollIntoView({behavior:'smooth'});
    return;
  }
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

document.querySelectorAll('[data-target]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const t = btn.dataset.target;
    const mobile = document.getElementById('mobileMenu');
    if(mobile.classList.contains('open')){
      mobile.classList.remove('open'); 
      mobile.style.display='none';
      mobile.setAttribute('aria-hidden','true');
    }
    scrollToId(t);
  });
});

/* mobile hamburger toggle */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', ()=>{
  if(mobileMenu.classList.contains('open')){
    mobileMenu.classList.remove('open'); 
    mobileMenu.style.display='none'; 
    mobileMenu.setAttribute('aria-hidden','true');
  } else {
    mobileMenu.classList.add('open'); 
    mobileMenu.style.display='block'; 
    mobileMenu.setAttribute('aria-hidden','false');
  }
});
mobileMenu.addEventListener('click', (e)=>{
  if(e.target === mobileMenu){
    mobileMenu.classList.remove('open'); 
    mobileMenu.style.display='none'; 
    mobileMenu.setAttribute('aria-hidden','true');
  }
});

/* ========== COUNTERS ========== */
function animateCounter(el, target, duration=1600){
  const start = 0;
  const diff = target - start;
  const stepTime = Math.max(Math.floor(duration / target), 6);
  let current = start;
  const timer = setInterval(()=>{
    current += Math.ceil(diff / (duration / 20));
    if(current >= target){
      current = target; clearInterval(timer);
    }
    el.textContent = current.toLocaleString();
  }, stepTime);
}
const procsEl = document.getElementById('count-procs');
const surgEl = document.getElementById('count-surgeries');

let countersStarted = false;
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && !countersStarted){
      countersStarted = true;
      animateCounter(procsEl, 1000, 1800);
      animateCounter(surgEl, 500, 1600);
      setTimeout(()=>{
        procsEl.textContent = '+' + procsEl.textContent;
        surgEl.textContent = '+' + surgEl.textContent;
      }, 1900);
    }
  });
},{threshold:0.35});
obs.observe(document.getElementById('inicio'));

/* ========== MAIN CAROUSEL ========== */
function makeCarousel(carouselId, interval=3000, hasDots=true){
  const root = document.getElementById(carouselId);
  const imgs = Array.from(root.querySelectorAll('img'));
  let idx = 0;

  let dotsContainer = null;
  if(hasDots){
    dotsContainer = root.querySelector('.dots') || document.createElement('div');
    if(!root.querySelector('.dots')){
      dotsContainer.className='dots';
      root.appendChild(dotsContainer);
    }
    imgs.forEach((_,i)=>{
      const dot = document.createElement('div'); 
      dot.className='dot'; 
      if(i===0) dot.classList.add('active');
      dot.addEventListener('click', ()=>{ show(i); reset(); });
      dotsContainer.appendChild(dot);
    });
  }

  function show(i){
    imgs.forEach((im,k)=> im.style.opacity = (k===i? '1':'0'));
    if(dotsContainer){
      Array.from(dotsContainer.children).forEach((d,k)=> d.classList.toggle('active', k===i));
    }
    idx = i;
  }

  function next(){ show((idx+1)%imgs.length) }

  let tid = setInterval(next, interval);
  function reset(){ clearInterval(tid); tid = setInterval(next, interval); }

  return {show, next, reset};
}
const mainCar = makeCarousel('mainCarousel',3000,true);
const sc1 = makeCarousel('sobreCarousel1',3000,false);
const sc2 = makeCarousel('sobreCarousel2',3000,false);

/* ========== PROCEDIMENTOS: modal com título, imagem, texto corrido e botão agendar ========== */
const procCards = document.querySelectorAll('.proc-card');
const procOverlay = document.getElementById('procOverlay');
const procModalTitle = document.getElementById('procModalTitle');
const procModalBody = document.getElementById('procModalBody');
const procClose = document.getElementById('procClose');

procCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.dataset.title || card.innerText;
    const body = card.dataset.body || '';
    const imgSrc = card.dataset.img || './imagens/default.png';

    procModalTitle.textContent = title;
    procModalTitle.style.color = '#d3a518'; // título amarelo
    procModalTitle.style.textAlign = 'center';   // centraliza o título

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = title;
    img.style.display = 'block';
    img.style.width = '200px';
    img.style.height = 'auto';
    img.style.margin = '10px auto';

    const p = document.createElement('p');
    p.textContent = body;
    p.style.marginTop = '10px';
    p.style.color = '#fff'; // descrição branca
    p.style.textAlign = 'center';                // centraliza a descrição

    // criar botão agendar
    const btnAgendar = document.createElement('button');
    btnAgendar.textContent = 'Agendar';
    btnAgendar.style.marginTop = '16px';
    btnAgendar.style.padding = '10px 20px';
    btnAgendar.style.border = 'none';
    btnAgendar.style.borderRadius = '8px';
    btnAgendar.style.backgroundColor = '#647cc2'; // azul
    btnAgendar.style.color = '#fff';              // fonte branca
    btnAgendar.style.cursor = 'pointer';
    btnAgendar.style.fontWeight = 'bold';
    btnAgendar.style.display = 'block';
    btnAgendar.style.marginLeft = 'auto';
    btnAgendar.style.marginRight = 'auto';        // centraliza
    btnAgendar.addEventListener('mouseover', ()=>{
        btnAgendar.style.backgroundColor = '#2cf504'; // hover verde
    });
    btnAgendar.addEventListener('mouseout', ()=>{
        btnAgendar.style.backgroundColor = '#647cc2'; // volta azul
    });
    btnAgendar.addEventListener('click', ()=>{
        window.open('https://wa.me/5561991686258?text=Olá! Quero agendar um procedimento.', '_blank');
    });

    // fundo branco do modal
    procOverlay.querySelector('.modal').style.backgroundColor = '#2B4C8C';

    procModalBody.innerHTML = '';
    procModalBody.appendChild(img);
    procModalBody.appendChild(p);
    procModalBody.appendChild(btnAgendar);

    procOverlay.classList.add('open');
    procOverlay.setAttribute('aria-hidden','false');
  });
});

procClose.addEventListener('click', ()=>{ 
  procOverlay.classList.remove('open'); 
  procOverlay.setAttribute('aria-hidden','true') 
});
procOverlay.addEventListener('click', (e)=>{ 
  if(e.target === procOverlay){ 
    procOverlay.classList.remove('open'); 
    procOverlay.setAttribute('aria-hidden','true') 
  } 
});

/* ========== DEPOIMENTOS: gallery overlay ========== */
const depoItems = Array.from(document.querySelectorAll('.depo-item'));
const gallery = document.getElementById('gallery');
const gImg = document.getElementById('gImg');
const gCaption = document.getElementById('gCaption');
const gClose = document.getElementById('gClose');
const gPrev = document.getElementById('gPrev'); 
const gNext = document.getElementById('gNext');

const depoImages = depoItems.map((it,idx)=> {
  const img = it.querySelector('img');
  return {src: img.src, alt: img.alt, idx: idx};
});

let gIdx = 0;
function openGallery(start){
  gIdx = start;
  gImg.src = depoImages[gIdx].src;
  gImg.alt = depoImages[gIdx].alt;
  gCaption.textContent = "";
  gallery.classList.add('open'); 
  gallery.setAttribute('aria-hidden','false');
}
depoItems.forEach((it, i)=> it.addEventListener('click', ()=> openGallery(i)));

gClose.addEventListener('click', ()=>{ 
  gallery.classList.remove('open'); 
  gallery.setAttribute('aria-hidden','true') 
});
gallery.addEventListener('click', (e)=>{ 
  if(e.target === gallery) { 
    gallery.classList.remove('open'); 
    gallery.setAttribute('aria-hidden','true') 
  } 
});
gPrev.addEventListener('click', ()=> { 
  gIdx = (gIdx-1+depoImages.length)%depoImages.length; 
  openGallery(gIdx) 
});
gNext.addEventListener('click', ()=> { 
  gIdx = (gIdx+1)%depoImages.length; 
  openGallery(gIdx) 
});

document.addEventListener('keydown', (e)=>{
  if(gallery.classList.contains('open')){
    if(e.key === 'ArrowLeft') gPrev.click();
    if(e.key === 'ArrowRight') gNext.click();
    if(e.key === 'Escape') gClose.click();
  }
});

/* ========== small accessibility improvements ========== */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Tab') document.body.classList.add('show-focus');
});
