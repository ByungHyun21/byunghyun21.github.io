// typing effect
const phrases = [
  'Local AI.',
  'Local Hardware.',
  'Nothing leaves the machine.'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, --charIdx);
  } else {
    typedEl.textContent = current.substring(0, ++charIdx);
  }
  let delay = isDeleting ? 30 : 65;
  if (!isDeleting && charIdx === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
if (typedEl) type();

// scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
