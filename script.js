/* =========================
   INTERACTIONS CONTROL
========================= */

let interactionsEnabled = false;

document.body.classList.add("loading");

window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.remove("loading");
    interactionsEnabled = true;
    initAOS();
  }, 800);
});

/* =========================
   CURSEUR AVEC TRAÎNÉE
========================= */

const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursorDot);

// Créer plusieurs points de traînée
const trailLength = 8;
const trails = [];

for (let i = 0; i < trailLength; i++) {
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  document.body.appendChild(trail);
  trails.push({
    element: trail,
    x: 0,
    y: 0
  });
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let currentX = mouseX;
let currentY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Interpolation smooth pour le point principal
  currentX += (mouseX - currentX) * 0.2;
  currentY += (mouseY - currentY) * 0.2;
  
  cursorDot.style.left = currentX - 4 + 'px';
  cursorDot.style.top = currentY - 4 + 'px';
  
  // Animer la traînée
  trails.forEach((trail, index) => {
    const delay = (index + 1) * 0.08;
    trail.x += (currentX - trail.x) * (0.15 - delay * 0.01);
    trail.y += (currentY - trail.y) * (0.15 - delay * 0.01);
    
    const opacity = 1 - (index / trailLength);
    trail.element.style.left = trail.x - 2 + 'px';
    trail.element.style.top = trail.y - 2 + 'px';
    trail.element.style.opacity = opacity * 0.6;
  });
  
  requestAnimationFrame(animateCursor);
}

animateCursor();

// Scale up sur hover
const interactiveElements = document.querySelectorAll('.project-card, button, .nav-btn, .dot, a');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform = 'scale(1.5)';
  });
  
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'scale(1)';
  });
});

/* =========================
   PARTICULES FLOTTANTES
========================= */

const particlesContainer = document.querySelector('.particles');
const particleCount = 30;

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.width = Math.random() * 4 + 2 + 'px';
  particle.style.height = particle.style.width;
  particle.style.background = `rgba(${100 + Math.random() * 155}, ${Math.random() * 100}, 255, ${Math.random() * 0.5})`;
  particle.style.borderRadius = '50%';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.filter = 'blur(1px)';
  particle.style.animation = `float ${10 + Math.random() * 20}s infinite ease-in-out`;
  particle.style.animationDelay = Math.random() * 5 + 's';
  
  particlesContainer.appendChild(particle);
}

// Animation CSS pour les particules (ajoutée dynamiquement)
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2);
    }
    50% {
      transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.8);
    }
    75% {
      transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.1);
    }
  }
`;
document.head.appendChild(style);

/* =========================
   CANVAS BACKGROUND
========================= */

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const lines = [];
const lineCount = 90;

for (let i = 0; i < lineCount; i++) {
  lines.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 0.3 + Math.random() * 0.7,
    length: 40 + Math.random() * 80,
    color: `rgba(${100 + Math.random() * 155}, ${Math.random() * 100}, 255, 0.25)`
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;

  lines.forEach(line => {
    ctx.strokeStyle = line.color;
    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.x, line.y + line.length);
    ctx.stroke();

    line.y += line.speed;
    if (line.y > canvas.height) {
      line.y = -line.length;
      line.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(animate);
}

animate();

/* =========================
   PROJECT CAROUSEL
========================= */

const carousel = document.querySelector(".project-carousel");
const cards = document.querySelectorAll(".project-card");

let current = 0;
let timer = null;
let paused = false;

function updatePositions() {
  cards.forEach(card => {
    card.classList.remove("left", "center", "right", "far-left", "far-right");
  });

  const total = cards.length;
  const leftIndex = (current - 1 + total) % total;
  const rightIndex = (current + 1) % total;
  const farLeftIndex = (current - 2 + total) % total;
  const farRightIndex = (current + 2) % total;

  cards[current].classList.add("center");
  cards[leftIndex].classList.add("left");
  cards[rightIndex].classList.add("right");
  cards[farLeftIndex].classList.add("far-left");
  cards[farRightIndex].classList.add("far-right");

  updateDots();
}

function next() {
  current = (current + 1) % cards.length;
  updatePositions();
}

function prev() {
  current = (current - 1 + cards.length) % cards.length;
  updatePositions();
}

function startCarousel() {
  stopCarousel();
  timer = setInterval(() => {
    if (paused) return;
    next();
  }, 3000);
}

function stopCarousel() {
  if (timer) clearInterval(timer);
}

// Pause sur hover de la carte centrale
cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    if (card.classList.contains("center")) {
      paused = true;
    }
  });

  card.addEventListener("mouseleave", () => {
    paused = false;
  });
});

/* =========================
   CAROUSEL NAVIGATION
========================= */

const carouselNav = document.querySelector('.carousel-nav');
const dotsContainer = document.querySelector('.carousel-dots');

// Créer les dots
cards.forEach((_, index) => {
  const dot = document.createElement('div');
  dot.className = 'dot';
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => {
    current = index;
    updatePositions();
    stopCarousel();
    startCarousel();
  });
  dotsContainer.appendChild(dot);
});

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === current);
  });
}

// Boutons prev/next
const prevBtn = document.querySelector('.nav-btn.prev');
const nextBtn = document.querySelector('.nav-btn.next');

prevBtn.addEventListener('click', () => {
  prev();
  stopCarousel();
  startCarousel();
});

nextBtn.addEventListener('click', () => {
  next();
  stopCarousel();
  startCarousel();
});

// Swipe mobile
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    next();
    stopCarousel();
    startCarousel();
  }
  if (touchEndX > touchStartX + 50) {
    prev();
    stopCarousel();
    startCarousel();
  }
}

// Démarrage
updatePositions();
startCarousel();

/* =========================
   OPEN PROJECT
========================= */

cards.forEach(card => {
  card.addEventListener("click", () => {
    if (!interactionsEnabled) return;
    if (!card.classList.contains("center")) return;

    interactionsEnabled = false;
    document.body.style.overflow = "hidden";
    stopCarousel();

    setTimeout(() => {
      document.body.classList.add("fade-out");
    }, 100);

    setTimeout(() => {
      const link = card.dataset.link;
      if (link) {
        window.location.href = link;
      }
    }, 600);
  });
});

/* =========================
   AOS (Animate On Scroll)
========================= */

function initAOS() {
  const aosElements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        
        // Animer les barres de compétences quand elles deviennent visibles
        if (entry.target.classList.contains('skill-category')) {
          animateSkillBars(entry.target);
        }
      }
    });
  }, {
    threshold: 0.2
  });

  aosElements.forEach(el => observer.observe(el));
}

/* =========================
   SKILL BARS ANIMATION
========================= */

function animateSkillBars(container) {
  const skillBars = container.querySelectorAll('.skill-progress-fill');
  
  skillBars.forEach((bar, index) => {
    setTimeout(() => {
      const progress = bar.getAttribute('data-progress');
      bar.style.width = progress + '%';
    }, index * 150); // Délai entre chaque barre
  });
}

/* =========================
   SMOOTH SCROLL
========================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* =========================
   PARALLAX EFFECT
========================= */

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    hero.style.opacity = 1 - (scrolled / 800);
  }
});

/* =========================
   KEYBOARD NAVIGATION
========================= */

document.addEventListener('keydown', (e) => {
  if (!interactionsEnabled) return;
  
  if (e.key === 'ArrowLeft') {
    prev();
    stopCarousel();
    startCarousel();
  } else if (e.key === 'ArrowRight') {
    next();
    stopCarousel();
    startCarousel();
  }
});

console.log("🚀 Portfolio chargé avec succès !");
console.log("💡 Utilisez les flèches du clavier ou swipez pour naviguer");