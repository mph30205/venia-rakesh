function slidesCount() {
  let itemsPerPage = 2;

  if (window.innerWidth >= 900) {
    itemsPerPage = 5;
  }
  return itemsPerPage;
}

function updateActiveSlide(slide, block) {
  const slides = block.querySelectorAll('.top-sellers .carousel-slide');
  const slideIndex = Array.from(slides).indexOf(slide);
  const visibleSlidesCount = slidesCount();

  block.dataset.activeSlide = slideIndex;

  slides.forEach((aSlide, idx) => {
    const isVisible = idx >= slideIndex && idx < slideIndex + visibleSlidesCount;

    aSlide.setAttribute('aria-hidden', !isVisible);
    aSlide.querySelectorAll('a, button').forEach((link) => {
      if (!isVisible) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator button');
  indicators.forEach((indicator, idx) => {
    indicator.disabled = idx >= slideIndex && idx < slideIndex + visibleSlidesCount;
  });
}

function showSlide(block, slideIndex) {
  const slides = block.querySelectorAll('.top-sellers .carousel-slide');
  const totalSlides = slides.length;
  // const visibleSlidesCount = slidesCount();

  const realIndex = (slideIndex + totalSlides) % totalSlides;

  const targetSlide = slides[realIndex];
  block.querySelector('.carousel-slides').scrollTo({
    left: targetSlide.offsetLeft,
    behavior: 'smooth',
  });

  updateActiveSlide(targetSlide, block);
}

function bindEvents(block) {
  const prevButton = block.querySelector('.slide-prev');
  const nextButton = block.querySelector('.slide-next');
  const visibleSlidesCount = slidesCount();

  prevButton.addEventListener('click', () => {
    const currentIndex = parseInt(block.dataset.activeSlide, 10);
    showSlide(block, currentIndex - visibleSlidesCount);
  });

  nextButton.addEventListener('click', () => {
    const currentIndex = parseInt(block.dataset.activeSlide, 10);
    showSlide(block, currentIndex + visibleSlidesCount);
  });
}

function createSlide(row, slideIndex) {
  const slide = document.createElement('li');
  slide.className = 'carousel-slide';
  slide.dataset.index = slideIndex;

  row.querySelectorAll(':scope > div').forEach((column) => {
    slide.appendChild(column);
  });

  return slide;
}

export default function decorate(block) {
  const slides = Array.from(block.children);
  const slidesContainer = document.createElement('ul');
  slidesContainer.className = 'carousel-slides';

  slides.forEach((row, index) => {
    const slide = createSlide(row, index);
    slidesContainer.appendChild(slide);
    row.remove();
  });

  block.appendChild(slidesContainer);

  const navButtons = document.createElement('div');
  navButtons.className = 'carousel-navigation-buttons';
  navButtons.innerHTML = `
      <button class="slide-prev" aria-label="Previous slide">◀</button>
      <button class="slide-next" aria-label="Next slide">▶</button>
  `;
  block.appendChild(navButtons);

  block.dataset.activeSlide = 0;
  bindEvents(block);
  updateActiveSlide(slidesContainer.firstChild, block);
}
