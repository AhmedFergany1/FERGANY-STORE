export function initSlider() {
  const slides = document.querySelectorAll(".slider-item");

  const prev = document.getElementById("prev-slide");
  const next = document.getElementById("next-slide");
  let currentIndex = 0;
  let slideInterval;

  function animateSlide(newIndex, direction) {
    if (newIndex === currentIndex) return;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[newIndex];

    // Reset styles
    slides.forEach((slide) => {
      slide.classList.remove("active", "slide-in-left", "slide-in-right");
      slide.style.display = "none";
    });

    // Set initial state for next slide
    nextSlide.style.display = "flex";

    // Trigger reflow (to ensure transition applies)
    void nextSlide.offsetWidth;

    // Animate current slide out
    currentSlide.classList.toggle(
      direction === "next" ? "slide-in-right" : "slide-in-left"
    );

    // Animate next slide in
    nextSlide.classList.add("active");
    // nextSlide.classList.remove(direction === "next" ? 'slide-in-left' : 'slide-in-right');

    currentIndex = newIndex;
  }

  function nextSlide() {
    const newIndex = (currentIndex + 1) % slides.length;
    animateSlide(newIndex, "next");
  }

  function prevSlide() {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    animateSlide(newIndex, "prev");
  }

  next.addEventListener("click", function (e) {
    e.preventDefault();
    nextSlide();
    resetInterval();
  });

  prev.addEventListener("click", function (e) {
    e.preventDefault();
    prevSlide();
    resetInterval();
  });

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 4000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  // Init first slide
  slides[currentIndex].classList.add("active");
  slides[currentIndex].style.display = "flex";
  startAutoSlide();
}
