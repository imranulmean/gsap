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

///////////// marquee JS ////////////

function initMarqueeScrollDirection() {
        document.querySelectorAll('[data-marquee-scroll-direction-target]').forEach((marquee) => {
            // Query marquee elements
            const marqueeContent = marquee.querySelector('[data-marquee-collection-target]');
            const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
            if (!marqueeContent || !marqueeScroll) return;
            
            // Get data attributes
            const { marqueeSpeed: speed, marqueeDirection: direction, marqueeDuplicate: duplicate, marqueeScrollSpeed: scrollSpeed } = marquee.dataset;
            
            // Convert data attributes to usable types
            const marqueeSpeedAttr = parseFloat(speed);
            const marqueeDirectionAttr = direction === 'right' ? 1 : -1; // 1 for right, -1 for left
            const duplicateAmount = parseInt(duplicate || 0);
            const scrollSpeedAttr = parseFloat(scrollSpeed);
            const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
            
            let marqueeSpeed = marqueeSpeedAttr * (marqueeContent.offsetWidth / window.innerWidth) * speedMultiplier;
            
            // Precompute styles for the scroll container
            marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
            marqueeScroll.style.width = `${(scrollSpeedAttr * 2) + 100}%`;
            
            // Duplicate marquee content
            if (duplicateAmount > 0) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < duplicateAmount; i++) {
            fragment.appendChild(marqueeContent.cloneNode(true));
            }
            marqueeScroll.appendChild(fragment);
            }
            
            // GSAP animation for marquee content
            const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');
            const animation = gsap.to(marqueeItems, {
            xPercent: -100, // Move completely out of view
            repeat: -1,
            duration: marqueeSpeed,
            ease: 'linear'
            }).totalProgress(0.1);
            
            // Initialize marquee in the correct direction
            gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
            animation.timeScale(marqueeDirectionAttr); // Set correct direction
            animation.play(); // Start animation immediately
            
            // Set initial marquee status
            marquee.setAttribute('data-marquee-status', 'normal');
            
            // ScrollTrigger logic for direction inversion
            ScrollTrigger.create({
                trigger: marquee,
                start: 'top bottom',
                end: 'bottom top',
                onUpdate: (self) => {
                    const isInverted = self.direction === 1; // Scrolling down
                    const currentDirection = isInverted ? -marqueeDirectionAttr : marqueeDirectionAttr;
                    
                    // Update animation direction and marquee status
                    animation.timeScale(currentDirection);
                    marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');
                }
            });
            
            // Extra speed effect on scroll
            const tl = gsap.timeline({
                scrollTrigger: {
                trigger: marquee,
                start: '0% 100%',
                end: '100% 0%',
                scrub: 0
                }
            });
            
            const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
            const scrollEnd = -scrollStart;
            
            tl.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${scrollEnd}vw`, ease: 'none' });
        });
    }
    
    // Initialize Marquee with Scroll Direction
    document.addEventListener('DOMContentLoaded', () => {
    initMarqueeScrollDirection();
    });
    