gsap.registerPlugin(ScrollTrigger);
const images = [
                "https://www.brandium.nl/wp-content/uploads/layer-15.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-20.webp",
                "https://www.brandium.nl/wp-content/uploads/layer-23.webp",
                "https://www.brandium.nl/wp-content/uploads/2023/07/branding-identity-brandium-1.webp",
                "https://www.brandium.nl/wp-content/uploads/Brandium__services-Branding.avif", 
                "https://www.brandium.nl/wp-content/uploads/layer-12.webp",
                "https://www.brandium.nl/wp-content/uploads/layer-3.webp",
                "https://www.brandium.nl/wp-content/uploads/layer-14.webp",
                "https://www.brandium.nl/wp-content/uploads/layer-18.webp",
                "https://www.brandium.nl/wp-content/uploads/layer-7.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-9.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-10.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-8.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-11.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-6.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-13.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-21.webp",
                "https://www.brandium.nl/wp-content/uploads/layer-5.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-1.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-19.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-4.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-17.webp", 
                "https://www.brandium.nl/wp-content/uploads/layer-2.webp",
                "https://www.brandium.nl/wp-content/uploads/layer-16.webp"
                ];

const imgB = document.querySelector(".next_image_b");
let index = 0;
let slideshowStarted = false;
async function showNext() {
  index = (index + 1) % images.length;
  const nextSrc = images[index];
  const bufferImg = new Image();
  bufferImg.src = nextSrc;
  await bufferImg.decode();
    imgB.src = nextSrc;
    imgB.style.opacity = 1;
}

function startSlideshow() {
  setInterval(showNext, 700);
}
const state = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30,
  radius: 40
};
gsap.timeline({
  scrollTrigger: {
    trigger: ".full-page.is-second",
    start: "top bottom",
    once: true,
    onEnter: () => {
      if (!slideshowStarted) {
        startSlideshow();
        slideshowStarted = true;
      }
    }
  }
});
gsap.timeline({
  scrollTrigger: {
    trigger: ".full-page.is-second",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true
  }
}).to(state, {
  top: 3,
  right: 3,
  bottom: 3,
  left: 3,
  radius: 10,
  ease: "none",
  onUpdate: () => {
    const clip = `inset(${state.top}% ${state.right}% ${state.bottom}% ${state.left}% round ${state.radius}px)`;
    document.querySelector(".next_image-wrap").style.clipPath = clip;
  }
});
gsap.fromTo(".next_image", {
  scale: 1.3
}, {
  scale: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".full-page.is-second",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});