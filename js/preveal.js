const video = document.getElementById("loopVideo");
if (video) {
    video.addEventListener("loadedmetadata", () => {
        video.currentTime = 0
    })
}
document.addEventListener("DOMContentLoaded", function() {
    const preventScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return !1
    };
    document.addEventListener("wheel", preventScroll, {
        passive: !1
    });
    document.addEventListener("touchmove", preventScroll, {
        passive: !1
    });
    document.addEventListener("keydown", (e) => {
        const keys = ["ArrowUp", "ArrowDown", "Space", "PageUp", "PageDown", "Home", "End"];
        if (keys.includes(e.code)) {
            e.preventDefault();
            e.stopPropagation();
            return !1
        }
    }, {
        passive: !1
    });
    setTimeout(() => {
        document.removeEventListener("wheel", preventScroll, {
            passive: !1
        });
        document.removeEventListener("touchmove", preventScroll, {
            passive: !1
        });
        document.removeEventListener("keydown", preventScroll, {
            passive: !1
        });
        document.body.style.cursor = "default"
    }, 3300);
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);
        CustomEase.create("ccvv", "M0,0 C0.9,0.1,0.1,1,1,1");
        CustomEase.create("ccc", "M0,0 C0.5,0.1 0.01,0.99 1,1");
        CustomEase.create("cubix", "M0,0 C0.3,0.1,0.02,1,1,1")
    }
    let trail__brActive = !0;
    setTimeout(() => {
        trail__brActive = !1
    }, 3000);
    const mainTl = gsap.timeline({
        delay: 0,
        onStart() {
            gsap.set("#logointro", {
                visibility: "visible",
                opacity: 1
            })
        }
    });
    mainTl.from("#logointro", {
        duration: 1.2,
        y: "105%",
        ease: "ccvv"
    }).to("#wipe-mask rect", {
        duration: 1.45,
        attr: {
            x: 0
        },
        ease: "ccvv"
    }, "+=0.14").to(".bgcontainer", {
        duration: 2,
        yPercent: -100,
        ease: "ccc"
    }).to("#logointro", {
        duration: 1.2,
        y: "-115%",
        ease: "ccvv"
    }, "-=2.5").add(() => {
        document.querySelector(".hiddensvg")?.remove();
        document.querySelector(".trail__br-container")?.remove()
    });

    function clamp(v, min, max) {
        return v < min ? min : v > max ? max : v
    }
    const VERT_SRC = `
attribute vec2 position;
attribute vec2 uv;
uniform vec2 uResolution;
uniform vec2 uTextureResolution;
varying vec2 vUv;
vec2 resizeUvCover(vec2 uv, vec2 size, vec2 resolution) {
vec2 ratio = vec2(
min((resolution.x / resolution.y) / (size.x / size.y), 1.0),
min((resolution.y / resolution.x) / (size.y / size.x), 1.0)
);
return vec2(
uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
uv.y * ratio.y + (1.0 - ratio.y) * 0.5
);
}
void main() {
vUv = resizeUvCover(uv, uTextureResolution, uResolution);
gl_Position = vec4(position, 0.0, 1.0);
}
`;
    const FRAG_SRC = `
precision highp float;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform vec2 uMouseIntro;
uniform vec2 uVelocity;
uniform float uIntro;
uniform float uRadius;
uniform float uStrength;
uniform float uBulge;
varying vec2 vUv;
vec2 bulge(vec2 uv, vec2 center) {
uv -= center;
float dist = length(uv) / uRadius;
float distPow = pow(dist, 4.0);
float strengthAmount = uStrength / (1.0 + distPow);
uv *= (1.0 - uBulge) + uBulge * strengthAmount;
uv += center;
return uv;
}
void main() {
vec2 mixMouse = mix(uMouseIntro, uMouse, uIntro);
vec2 bulgeUV = bulge(vUv, mixMouse);
float speed = length(uVelocity);
float strength = clamp(speed * 0.015, 0.0, 0.015);
vec2 dir = normalize(uVelocity + vec2(0.00001, 0.00001));
vec2 uvR = bulgeUV + dir * strength;
vec2 uvG = bulgeUV;
vec2 uvB = bulgeUV - dir * strength;
vec4 texR = texture2D(uTexture, uvR);
vec4 texG = texture2D(uTexture, uvG);
vec4 texB = texture2D(uTexture, uvB);
vec3 color = vec3(texR.r, texG.g, texB.b);
gl_FragColor = vec4(color, 1.0);
}
`;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null
        }
        return shader
    }

    function createProgram(gl, vertSrc, fragSrc) {
        const vShader = createShader(gl, gl.VERTEX_SHADER, vertSrc);
        const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
        if (!vShader || !fShader) return null;
        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null
        }
        return program
    }
    class Demo1Card {
        constructor(el) {
            this.el = el;
            this.imageSrc = el.getAttribute("data-image");
            this.mouse = {
                x: 0.5,
                y: 0.5
            };
            this.mouseTarget = {
                x: 0.5,
                y: 0.5
            };
            this.prevMouse = {
                x: 0.5,
                y: 0.5
            };
            this.velocity = {
                x: 0.0,
                y: 0.0
            };
            this.intro = 0.0;
            this.introTarget = 0.0;
            this.bulge = 0.0;
            this.bulgeTarget = 0.0;
            this.radius = 0.99;
            this.strength = 1.1;
            this.time = 0;
            this._setupDOM();
            this._initGL();
            this._loadTexture();
            this._bindEvents();
            this.el.__webglCard = this
        }
        _setupDOM() {
            this.canvasWrapper = document.createElement("div");
            this.canvasWrapper.className = "canvas-scale";
            this.el.appendChild(this.canvasWrapper);
            this.canvas = document.createElement("canvas");
            this.canvasWrapper.appendChild(this.canvas)
        }
        _initGL() {
            const gl = this.canvas.getContext("webgl", {
                antialias: !0
            });
            if (!gl) return;
            this.gl = gl;
            this.program = createProgram(gl, VERT_SRC, FRAG_SRC);
            if (!this.program) return;
            gl.useProgram(this.program);
            const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
            const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
            const aPosition = gl.getAttribLocation(this.program, "position");
            gl.enableVertexAttribArray(aPosition);
            gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, !1, 0, 0);
            const uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
            const aUv = gl.getAttribLocation(this.program, "uv");
            gl.enableVertexAttribArray(aUv);
            gl.vertexAttribPointer(aUv, 2, gl.FLOAT, !1, 0, 0);
            this.uTime = gl.getUniformLocation(this.program, "uTime");
            this.uTexture = gl.getUniformLocation(this.program, "uTexture");
            this.uResolution = gl.getUniformLocation(this.program, "uResolution");
            this.uTextureResolution = gl.getUniformLocation(this.program, "uTextureResolution");
            this.uMouse = gl.getUniformLocation(this.program, "uMouse");
            this.uMouseIntro = gl.getUniformLocation(this.program, "uMouseIntro");
            this.uIntro = gl.getUniformLocation(this.program, "uIntro");
            this.uRadius = gl.getUniformLocation(this.program, "uRadius");
            this.uStrength = gl.getUniformLocation(this.program, "uStrength");
            this.uBulge = gl.getUniformLocation(this.program, "uBulge");
            this.uVelocity = gl.getUniformLocation(this.program, "uVelocity");
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            this._resize();
            window.addEventListener("resize", () => this._resize())
        }
        _loadTexture() {
            if (!this.gl) return;
            const gl = this.gl;
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = this.imageSrc;
            img.onload = () => {
                this.textureWidth = img.naturalWidth;
                this.textureHeight = img.naturalHeight;
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !0);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.bindTexture(gl.TEXTURE_2D, null);
                this._start()
            }
        }
        _bindEvents() {
            this.el.addEventListener("mousemove", (e) => {
                const rect = this.el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                this.mouseTarget.x = clamp(x, 0, 1);
                this.mouseTarget.y = clamp(1.0 - y, 0, 1)
            });
            this.el.addEventListener("mouseenter", () => {
                this.bulgeTarget = 0.35
            });
            this.el.addEventListener("mouseleave", () => {
                this.bulgeTarget = 0.0
            })
        }
        _resize() {
            if (!this.gl) return;
            const gl = this.gl;
            const rect = this.el.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = rect.width * dpr;
            const height = rect.height * dpr;
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style.width = rect.width + "px";
            this.canvas.style.height = rect.height + "px";
            gl.viewport(0, 0, width, height);
            gl.useProgram(this.program);
            gl.uniform2f(this.uResolution, width, height)
        }
        _start() {
            if (this._running) return;
            this._running = !0;
            this._loop()
        }
        _loop() {
            if (!this._running || !this.gl) return;
            this._render();
            requestAnimationFrame(() => this._loop())
        }
        _render() {
            const gl = this.gl;
            this.time += 0.016;
            this.mouse.x += (this.mouseTarget.x - this.mouse.x) * 0.15;
            this.mouse.y += (this.mouseTarget.y - this.mouse.y) * 0.15;
            const dx = this.mouse.x - this.prevMouse.x;
            const dy = this.mouse.y - this.prevMouse.y;
            this.velocity.x += dx * 0.8;
            this.velocity.y += dy * 0.8;
            this.velocity.x *= 0.85;
            this.velocity.y *= 0.85;
            this.prevMouse.x = this.mouse.x;
            this.prevMouse.y = this.mouse.y;
            this.intro += (this.introTarget - this.intro) * 0.02;
            this.bulge += (this.bulgeTarget - this.bulge) * 0.12;
            gl.useProgram(this.program);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            const width = this.canvas.width;
            const height = this.canvas.height;
            gl.viewport(0, 0, width, height);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform1f(this.uTime, this.time);
            gl.uniform2f(this.uTextureResolution, this.textureWidth || 1, this.textureHeight || 1);
            gl.uniform2f(this.uMouse, this.mouse.x, this.mouse.y);
            gl.uniform2f(this.uMouseIntro, 0.5, 0.0);
            gl.uniform1f(this.uIntro, this.intro);
            gl.uniform1f(this.uRadius, this.radius);
            gl.uniform1f(this.uStrength, this.strength);
            gl.uniform1f(this.uBulge, this.bulge);
            gl.uniform2f(this.uVelocity, this.velocity.x, this.velocity.y);
            gl.uniform1i(this.uTexture, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6)
        }
    }
    const cards = document.querySelectorAll(".project__cover.viewergl-card");
    cards.forEach((el) => {
        if (el.hasAttribute("data-image")) {
            new Demo1Card(el)
        }
    });
    const firstTwoCards = Array.from(cards).slice(0, 4);
    const restCards = Array.from(cards).slice(4);
    const wraps = Array.from(cards).map((c) => c.querySelector(".canvas-scale"));

    function getColors() {
        const root = getComputedStyle(document.documentElement);
        return {
            initial: root.getPropertyValue("--color-initial") || "#dddddd",
            accent: root.getPropertyValue("--color-accent") || "#d9ff06",
            finalC: root.getPropertyValue("--color-final") || "#000000"
        }
    }
    const el = document.querySelector(".landingintro");
    if (el) {
        const childSplit = new SplitText(el, {
            type: "lines",
            linesClass: "split-child"
        });
        new SplitText(el, {
            linesClass: "split-parent"
        });
        const allChars = [];
        childSplit.lines.forEach((line) => {
            const splitWords = new SplitText(line, {
                type: "words",
                wordsClass: "word"
            });
            const splitChars = new SplitText(splitWords.words, {
                type: "chars",
                charsClass: "char"
            });
            allChars.push(...splitChars.chars)
        });
        const {
            initial,
            accent,
            finalC
        } = getColors();
        gsap.set(allChars, {
            color: initial
        });
        mainTl.fromTo(childSplit.lines, {
            yPercent: 100,
            rotateX: -200,
            skewY: -5,
            scale: 0.2,
            autoAlpha: 0
        }, {
            yPercent: 0,
            rotateX: 0,
            skewY: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1.7,
            ease: "cubix",
            stagger: 0.15,
            onStart: () => {
                el.style.visibility = "visible"
            }
        }, "-=1.5");
        mainTl.add(() => {
            allChars.forEach((char, idx) => {
                gsap.to(char, {
                    color: accent,
                    duration: 0.12,
                    delay: idx * 0.007,
                    onComplete: () => {
                        gsap.to(char, {
                            color: finalC,
                            duration: 0.6,
                            overwrite: !0
                        })
                    }
                })
            })
        }, "-=1.5")
    }
    const splitterEl = document.querySelector(".splittertxt");
    if (splitterEl) {
        const splitterSplit = new SplitText(splitterEl, {
            type: "lines",
            linesClass: "split-child"
        });
        new SplitText(splitterEl, {
            linesClass: "split-parent"
        });
        mainTl.fromTo(splitterSplit.lines, {
            yPercent: 110,
            autoAlpha: 1
        }, {
            duration: 1.7,
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.1,
            ease: "ccc",
            onStart: () => {
                splitterEl.style.visibility = "visible"
            }
        }, "-=2.2")
    }
    gsap.set(cards, {
        clipPath: "inset(50% 50% 50% 50%)",
        y: 30,
        visibility: "hidden",
        scale: 1
    });
    gsap.set(wraps, {
        scale: 1.4,
        transformOrigin: "center center"
    });
    mainTl.add(() => {
        firstTwoCards.forEach((elCard) => {
            elCard.style.visibility = "visible";
            const cardObj = elCard.__webglCard;
            if (cardObj) {
                cardObj.introTarget = 0.4;
                cardObj.bulgeTarget = 0.0
            }
        })
    }, "-=2.1");
    mainTl.to(firstTwoCards, {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        y: 0,
        duration: 2.3,
        ease: "cubix",
        stagger: {
            each: 0.25,
            from: "start"
        }
    }, "<");
    mainTl.to(wraps.slice(0, 4), {
        scale: 1,
        duration: 2.3,
        ease: "cubix",
        stagger: {
            each: 0.25,
            from: "start"
        },
        onStart: () => {
            firstTwoCards.forEach((elCard) => {
                const cardObj = elCard.__webglCard;
                if (cardObj) {
                    cardObj.introTarget = 1.0;
                    cardObj.bulgeTarget = 0.4
                }
            })
        }
    }, "<");
    restCards.forEach((elCard, i) => {
        const wrap = elCard.querySelector(".canvas-scale");
        gsap.to(elCard, {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            y: 0,
            duration: 2,
            ease: "cubix",
            scrollTrigger: {
                trigger: elCard,
                start: "top 85%",
                once: !0,
                onEnter: () => {
                    elCard.style.visibility = "visible"
                }
            },
            delay: i * 0.05
        });
        if (wrap) {
            gsap.to(wrap, {
                scale: 1,
                duration: 2,
                ease: "cubix",
                scrollTrigger: {
                    trigger: elCard,
                    start: "top 85%",
                    once: !0
                },
                delay: i * 0.05
            })
        }
    });
    mainTl.fromTo("path.svgbrandium", {
        y: 80,
        autoAlpha: 1
    }, {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.018,
        ease: "power4.inOut"
    }, "<0.5").fromTo(".btn-click.magnetic", {
        scale: 0,
        autoAlpha: 1
    }, {
        scale: 1,
        autoAlpha: 1,
        duration: 1.2,
        ease: "power4.inOut"
    }, "=-1.5").fromTo(".pulse-list > *", {
        y: 50,
        autoAlpha: 1
    }, {
        y: 0,
        autoAlpha: 1,
        duration: 2,
        ease: "power4.inOut",
        stagger: 0.04
    }, "=-2.5").fromTo(".cta-stack", {
        y: 20,
        autoAlpha: 0
    }, {
        y: 0,
        autoAlpha: 1,
        duration: 1.2,
        ease: "power4.inOut"
    }, "<0.5").fromTo(".parallax-hero", {
        scale: 1.2,
        filter: "blur(0px)",
        autoAlpha: 0
    }, {
        scale: 1,
        filter: "blur(0px)",
        autoAlpha: 1,
        duration: 2.5,
        ease: "expo.out"
    }, "<0.1");
    const config = {
        imageLifespan: 850,
        mouseThreshold: 125,
        inDuration: 400,
        outDuration: 800,
        staggerIn: 50,
        staggerOut: 35,
        slideDuration: 1000,
        slideEasing: "cubic-bezier(0.4, 0, 0.1, 1)",
        easing: "cubic-bezier(0.6, 0, 0.1, 1)",
        createInterval: 70
    };
    const trail__brImageCount = 42;
    const images = Array.from({
        length: trail__brImageCount
    }, (_, i) => `/img${i + 1}.webp`);
    const trail__brContainer = document.querySelector(".trail__br-container");
    let isDesktop = window.innerWidth > 1000;
    const trail__br = [];
    let shuffledImages = [];
    let lastUsedImage = null;
    const shuffleArray = (arr) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    };
    const getNextRandomImage = () => {
        if (shuffledImages.length === 0) {
            let newShuffled;
            do {
                newShuffled = shuffleArray(images)
            } while (newShuffled[0] === lastUsedImage && images.length > 1);
            shuffledImages = newShuffled
        }
        const nextImage = shuffledImages.shift();
        lastUsedImage = nextImage;
        return nextImage
    };
    let mousePos = {
        x: 0,
        y: 0
    };
    let lastMousePos = {
        x: 0,
        y: 0
    };
    let interpolatedMousePos = {
        x: 0,
        y: 0
    };
    let lastCreateTime = 0;
    const MathUtils = {
        lerp: (a, b, n) => (1 - n) * a + n * b,
        distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
    };
    const getMouseDistance = () => MathUtils.distance(...Object.values(mousePos), ...Object.values(lastMousePos));
    const isInTrailContainer = (x, y) => {
        const rect = trail__brContainer.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    };
    const createTrailImage = () => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("trail__br-img");
        const imgSrc = getNextRandomImage();
        const rect = trail__brContainer.getBoundingClientRect();
        const startX = interpolatedMousePos.x - rect.left - 87.5;
        const startY = interpolatedMousePos.y - rect.top - 87.5;
        const targetX = mousePos.x - rect.left - 87.5;
        const targetY = mousePos.y - rect.top - 87.5;
        imgContainer.style.left = `${startX}px`;
        imgContainer.style.top = `${startY}px`;
        imgContainer.style.transition = `left ${config.slideDuration}ms ${config.slideEasing}, ` + `top ${config.slideDuration}ms ${config.slideEasing}`;
        const maskLayers = [];
        const imageLayers = [];
        for (let i = 0; i < 10; i++) {
            const layer = document.createElement("div");
            layer.classList.add("mask-layer");
            const imageLayer = document.createElement("div");
            imageLayer.classList.add("image-layer");
            imageLayer.style.backgroundImage = `url(${imgSrc})`;
            const startY = i * 10;
            const endY = (i + 1) * 10;
            layer.style.clipPath = `polygon(50% ${startY}%, 50% ${startY}%, 50% ${endY}%, 50% ${endY}%)`;
            layer.style.transition = `clip-path ${config.inDuration}ms ${config.easing}`;
            layer.style.transform = "translateZ(0)";
            layer.style.backfaceVisibility = "hidden";
            layer.appendChild(imageLayer);
            imgContainer.appendChild(layer);
            maskLayers.push(layer);
            imageLayers.push(imageLayer)
        }
        trail__brContainer.appendChild(imgContainer);
        requestAnimationFrame(() => {
            imgContainer.style.left = `${targetX}px`;
            imgContainer.style.top = `${targetY}px`;
            maskLayers.forEach((layer, i) => {
                const startY = i * 10;
                const endY = (i + 1) * 10;
                const distanceFromMiddle = Math.abs(i - 4.5);
                const delay = distanceFromMiddle * config.staggerIn;
                setTimeout(() => {
                    layer.style.clipPath = `polygon(0% ${startY}%, 100% ${startY}%, 100% ${endY}%, 0% ${endY}%)`
                }, delay)
            })
        });
        trail__br.push({
            element: imgContainer,
            maskLayers,
            imageLayers,
            removeTime: Date.now() + config.imageLifespan,
        })
    };
    const removeOldImages = () => {
        const now = Date.now();
        if (trail__br.length === 0) return;
        const oldestImage = trail__br[0];
        if (now >= oldestImage.removeTime) {
            const imgToRemove = trail__br.shift();
            imgToRemove.maskLayers.forEach((layer, i) => {
                const startY = i * 10;
                const endY = (i + 1) * 10;
                const distanceFromEdge = 4.5 - Math.abs(i - 4.5);
                const delay = distanceFromEdge * config.staggerOut;
                layer.style.transition = `clip-path ${config.outDuration}ms ${config.easing}`;
                setTimeout(() => {
                    layer.style.clipPath = `polygon(50% ${startY}%, 50% ${startY}%, 50% ${endY}%, 50% ${endY}%)`
                }, delay)
            });
            imgToRemove.imageLayers.forEach((imageLayer) => {
                imageLayer.style.transition = `opacity ${config.outDuration}ms ${config.easing}`;
                imageLayer.style.opacity = "0.9955"
            });
            setTimeout(() => {
                if (imgToRemove.element.parentNode) {
                    imgToRemove.element.parentNode.removeChild(imgToRemove.element)
                }
            }, config.outDuration + 150)
        }
    };
    const render = () => {
        const now = Date.now();
        interpolatedMousePos.x = MathUtils.lerp(interpolatedMousePos.x || mousePos.x, mousePos.x, 0.05);
        interpolatedMousePos.y = MathUtils.lerp(interpolatedMousePos.y || mousePos.y, mousePos.y, 0.05);
        const distance = getMouseDistance();
        if (isDesktop && trail__brActive && distance > config.mouseThreshold && isInTrailContainer(mousePos.x, mousePos.y) && (now - lastCreateTime) > config.createInterval) {
            createTrailImage();
            lastMousePos = {
                ...mousePos
            };
            lastCreateTime = now
        }
        removeOldImages();
        requestAnimationFrame(render)
    };
    const startAnimation = () => {
        if (!isDesktop) return;
        document.addEventListener("mousemove", (e) => {
            mousePos = {
                x: e.clientX,
                y: e.clientY
            }
        });
        requestAnimationFrame(render)
    };
    const stopAnimation = () => {
        trail__br.forEach((item) => {
            if (item.element.parentNode) {
                item.element.parentNode.removeChild(item.element)
            }
        });
        trail__br.length = 0
    };
    window.addEventListener("resize", () => {
        const wasDesktop = isDesktop;
        isDesktop = window.innerWidth > 1000;
        if (isDesktop && !wasDesktop) startAnimation();
        else if (!isDesktop && wasDesktop) stopAnimation()
    });
    if (isDesktop) startAnimation()
})