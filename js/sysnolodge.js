gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

function loadSection1(){
    var tl1= gsap.timeline();
    let splitMainHeader = SplitText.create(".section1 .main-header", { type: "words, chars" });    

    tl1.from(".section1",{
        opacity:0,
        scale:0, 
        duration:0.8,
        transformOrigin:'top right'
    })
    tl1.from(splitMainHeader.words, {
        y: -150,
        opacity: 0,
        stagger: 0.2
    })  
    
    tl1.from(".section1 .subheader, .section1 p",{
        opacity:0,
        stagger:0.2,
        // scale:0,
        x:-150
    })
}

function loadSection3(){
    gsap.from('.section3 .services .wp-block-uagb-container',{
        y:'-150px',
        opacity:0,
        stagger:0.5,
        scrollTrigger:{
            trigger:'.section3',
            start:'top center',
        }
    })
}

function loadSection4(){
    gsap.from(".section4",{
        opacity:0,
        duration:1,
        x:-100
    })
    
    gsap.fromTo(".section4 .wp-block-uagb-icon-list-child", 
        {
            x:'-150px',
            opacity: 0
        },{
            x:'0px',
            opacity: 1,  
            stagger:0.2,
            scrollTrigger:{
                trigger:".section4",
                start:"top center",
                // markers:true
        
            }        
        }
    );
}

document.addEventListener('DOMContentLoaded',function(){

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });
    gsap.ticker.lagSmoothing(0);    
    
    if(screen.width>500){
        loadSection1();
        loadSection3();
        loadSection4();
    }

})
