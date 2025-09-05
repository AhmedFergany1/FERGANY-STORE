export function initSlider() {
  try {
    const slides = document.querySelectorAll(".slider-item");
    if (!slides.length) throw new Error("No slides found with class '.slider-item'");

    const prev = document.getElementById("prev-slide");
    const next = document.getElementById("next-slide");

    if (!prev || !next) throw new Error("Prev or Next slide buttons not found");

    let currentIndex = 0;
    let slideInterval;

    function animateSlide(newIndex, direction) {
      try {
        if (newIndex === currentIndex) return;

        const currentSlide = slides[currentIndex];
        const nextSlide = slides[newIndex];

        if (!currentSlide || !nextSlide) throw new Error("Slide element missing during animation");

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

        currentIndex = newIndex;
      } catch (err) {
        console.error("Error during slide animation:", err);
      }
    }

    function nextSlide() {
      try {
        const newIndex = (currentIndex + 1) % slides.length;
        animateSlide(newIndex, "next");
      } catch (err) {
        console.error("Error in nextSlide function:", err);
      }
    }

    function prevSlide() {
      try {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        animateSlide(newIndex, "prev");
      } catch (err) {
        console.error("Error in prevSlide function:", err);
      }
    }

    next.addEventListener("click", function (e) {
      try {
        e.preventDefault();
        nextSlide();
        resetInterval();
      } catch (err) {
        console.error("Error handling next button click:", err);
      }
    });

    prev.addEventListener("click", function (e) {
      try {
        e.preventDefault();
        prevSlide();
        resetInterval();
      } catch (err) {
        console.error("Error handling prev button click:", err);
      }
    });

    function startAutoSlide() {
      try {
        slideInterval = setInterval(nextSlide, 4000);
      } catch (err) {
        console.error("Error starting auto slide:", err);
      }
    }

    function resetInterval() {
      try {
        clearInterval(slideInterval);
        startAutoSlide();
      } catch (err) {
        console.error("Error resetting slide interval:", err);
      }
    }

    // Init first slide
    slides[currentIndex].classList.add("active");
    slides[currentIndex].style.display = "flex";
    startAutoSlide();
  } catch (err) {
    console.error("Error initializing slider:", err);
  }
}
