gsap.registerPlugin(ScrollTrigger);

function loadSection1(){
    var tl1= gsap.timeline();
    var topHeader= document.querySelector(".top-header-container h2");
    var words =topHeader.textContent.split(" ");
    topHeader.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(" ");
    
    var subheader=document.querySelector(".subheader");
    var subWords =subheader.textContent.split(" ");
    subheader.innerHTML=subWords.map((w)=>`<span class="sub-word">${w}</span>`).join(" ");
    tl1.from(".section1",{
        opacity:0,
        duration:1,
        y:-100
    })
    tl1.from(".top-header-container h2 .word, .top-header-container .sub-word, .top-header-container p",{
        opacity:0,
        stagger:0.2,
        // scale:0,
        x:-150
    })
}

function loadSection3(){
    gsap.from(".section3",{
        opacity:0,
        duration:1,
        x:-100
    })
    
    gsap.fromTo(".section3 .wp-block-uagb-icon-list-child", 
        {
            x:'-150px',
            opacity: 0
        },{
            x:'0px',
            opacity: 1,  
            stagger:1,
            scrollTrigger:{
                trigger:".section3",
                start:"top center",
                // markers:true
        
            }        
        }
    );
}

loadSection1();
loadSection3();
document.addEventListener('mousemove',(dets)=>{
    gsap.to('.mouse-pointer',{
        x:`${dets.x}px`,
        y:`${dets.y}px`,
    })
})