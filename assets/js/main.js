// Navbar scroll
const nav = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 50);
});

// Carousel
const slides = document.querySelectorAll(".carousel-slide");
const navContainer = document.getElementById("carouselNav");
const counter = document.getElementById("carouselCounter");
let current = 0, interval;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "carousel-dot" + (i === 0 ? " active" : "");
  dot.onclick = () => goTo(i);
  navContainer.appendChild(dot);
});

function goTo(idx) {
  slides[current].classList.remove("active");
  slides[current]
    .querySelectorAll(".slide-tag,.slide-title,.slide-desc,.slide-btn")
    .forEach((el) => {
      el.style.animation = "none";
      el.offsetHeight;
      el.style.animation = "";
    });
  navContainer.children[current].classList.remove("active");
  current = idx;
  slides[current].classList.add("active");
  navContainer.children[current].classList.add("active");
  counter.textContent = String(current + 1).padStart(2, "0");
  resetInterval();
}

function next() {
  goTo((current + 1) % slides.length);
}
function resetInterval() {
  clearInterval(interval);
  interval = setInterval(next, 5500);
}
resetInterval();

// Particles
const particlesEl = document.getElementById("particles");
for (let i = 0; i < 30; i++) {
  const p = document.createElement("div");
  p.className = "particle";
  p.style.left = Math.random() * 100 + "%";
  p.style.animationDuration = 8 + Math.random() * 12 + "s";
  p.style.animationDelay = Math.random() * 10 + "s";
  p.style.width = p.style.height = 2 + Math.random() * 3 + "px";
  if (Math.random() > 0.5) p.style.background = "#ff6584";
  particlesEl.appendChild(p);
}

// Scroll Reveal
const revealEls = document.querySelectorAll(
  ".reveal,.reveal-left,.reveal-right,.reveal-scale"
);
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
);
revealEls.forEach((el) => observer.observe(el));

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// Tilt effect on service cards
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
