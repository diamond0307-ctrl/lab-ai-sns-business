const backgroundVideo = document.querySelector('#hero-video');
const toggle = document.querySelector('.motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let pausedByVisitor = reducedMotion.matches;
let openingVisible = true;
let visitorPlay = false;

function paintPlaybackControl() {
  const paused = backgroundVideo.paused;
  toggle.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
  toggle.querySelector('.motion-label').textContent = paused ? '背景を再生' : '背景を停止';
  toggle.setAttribute('aria-label', paused ? '背景動画を再生' : '背景動画を一時停止');
}

function updatePlayback() {
  if (pausedByVisitor || !openingVisible || document.hidden || (reducedMotion.matches && !visitorPlay)) {
    backgroundVideo.pause();
  } else {
    backgroundVideo.play().catch(paintPlaybackControl);
  }
  paintPlaybackControl();
}

backgroundVideo.muted = true;
backgroundVideo.addEventListener('play', paintPlaybackControl);
backgroundVideo.addEventListener('pause', paintPlaybackControl);
toggle.addEventListener('click', () => {
  pausedByVisitor = !backgroundVideo.paused;
  visitorPlay = !pausedByVisitor;
  updatePlayback();
});
reducedMotion.addEventListener('change', () => {
  pausedByVisitor = reducedMotion.matches;
  visitorPlay = false;
  updatePlayback();
});
document.addEventListener('visibilitychange', updatePlayback);
new IntersectionObserver(entries => {
  openingVisible = entries[0].isIntersecting;
  updatePlayback();
}, { threshold: 0 }).observe(document.querySelector('.opening-world'));
new IntersectionObserver(entries => {
  const heroPassed = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
  document.body.classList.toggle('past-hero', heroPassed);
}, { threshold: 0 }).observe(document.querySelector('.hero'));
document.querySelectorAll('.questions details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('.questions details').forEach(other => {
      if (other !== detail) other.open = false;
    });
  });
});
updatePlayback();
