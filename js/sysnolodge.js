gsap.registerPlugin(ScrollTrigger);

var tl1= gsap.timeline();
var topHeader= document.querySelector(".top-header-container h2");
var words =topHeader.textContent.split(" ");
topHeader.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(" ");

tl1.from(".section1",{
    opacity:0,
    duration:1,
    y:-100
})
tl1.from(".top-header-container h2 .word, .top-header-container h2, .top-header-container p",{
    opacity:0,
    stagger:0.3,
    scale:0,
    // x:-150
})

    gsap.to(".section3 .wp-block-uagb-icon-list-child", {
      opacity: 1,  
      stagger:1
    });