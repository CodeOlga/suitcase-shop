document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".slider-wrapper");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const nextBtn = document.querySelector(".slider-btn.next");

  if (!wrapper) return;

  let index = 0;
  const visibleSlides = 4;

  function showSlide(i) {
    const maxIndex = slides.length - visibleSlides;
    if (i < 0) index = maxIndex;
    else if (i > maxIndex) index = 0;

    const slideWidth = slides[0].offsetWidth + 38;
    wrapper.style.transform = `translateX(${-index * slideWidth}px)`;
  }

  nextBtn.addEventListener("click", () => {
    index++;
    showSlide(index);
  });

  prevBtn.addEventListener("click", () => {
    index--;
    showSlide(index);
  });
});
