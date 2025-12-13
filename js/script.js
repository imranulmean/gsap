// // gsap.from("#page #box",{
// //     scale:0,
// //     opacity:0,
// //     rotate:720,
// //     duration:1,
// //     scrollTrigger:{
// //         trigger:"#page #box",
// //         scroller:"body",
// //         markers:true,
// //         start:"top 60%",
// //         end:"top 30%",
// //         scrub:2
// //     }
// // }) 

// // gsap.to("#page2 h1",{
// //     transform:"translateX(-150%)",
// //     scrollTrigger:{
// //         trigger:"#page2",
// //         scroller:"body",
// //         start:"top 0%",
// //         scrub:1,
// //         pin:true


// //     }
// // })
// // gsap.registerPlugin(ScrollTrigger);
// var path=`M 50 100 Q 250 100 450 100`;
// var finalPath=`M 50 100 Q 250 100 450 100`;

// var string = document.querySelector("#string");

// string.addEventListener('mousemove',function(dets){
//     console.log(dets);
//     path=`M 50 100 Q ${dets.x} ${dets.y} 450 100`;
//     gsap.to("svg path",{
//         attr:{d:path},
//         duration:0.3,
//         ease:"power3.out"
//     })
// })

// string.addEventListener('mouseleave',function(dets){
//     console.log(dets);
//     path=`M 50 100 Q 250 ${dets.y} 450 100`;
//     gsap.to("svg path",{
//         attr:{d:finalPath},
//         duration:5,
//         ease: "elastic.out(1,0.1)"

//     })
// })

// // ScrollTrigger.create({
// //     trigger:"#page2",
// //     start:"top 0%",
// //     pin:true,
// //     scrub:true
// //   });

// gsap.to("#block1",{
//     scale:1,
//     scrollTrigger:{
//         trigger:"#page2",
//         scroller:"body",
//         pin:true,
//         scrub:2,
//         start: "top top"
//     }
// })



gsap.registerPlugin(ScrollTrigger);

/* animate the overlay's clip-path from a tiny top-left ellipse to a large, horizontal ellipse
   that gives a parabola-like curved edge. Tweak the radii/center to taste. */
gsap.to(".overlay",
  {
    clipPath: "ellipse(95% 60% at 55% 45%)",   // ~90% coverage with a curved end
    ease: "none",
    scrollTrigger: {
      trigger: "#page2",
      pin: true,         // pins the page2 while animating
      scrub: 1,
      start: "top top",
      end: "+=800"
    }
  }
);

gsap.to(".overlay3",
  {
    clipPath: "ellipse(150% 150% at 100% 100%)",   // ~90% coverage with a curved end
    ease: "none",
    scrollTrigger: {
      trigger: "#page3",
      pin: true,         // pins the page2 while animating
      scrub: 1,
      start: "top top",
      end: "+=800",   // increase/decrease for longer/shorter reveal
    }
  }
);