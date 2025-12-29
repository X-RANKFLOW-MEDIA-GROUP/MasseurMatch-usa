(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/masseurmatch-nextjs/components/ComingSoon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ComingSoonContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/masseurmatch-nextjs/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/masseurmatch-nextjs/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/masseurmatch-nextjs/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/masseurmatch-nextjs/node_modules/gsap/ScrollTrigger.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
if ("TURBOPACK compile-time truthy", 1) {
    __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].registerPlugin(__TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollTrigger"]);
}
function ComingSoonContent() {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const titleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [submitted, setSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [countdown, setCountdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [mousePos, setMousePos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0.5,
        y: 0.5
    });
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const launchDate = new Date('2025-03-01T00:00:00').getTime();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComingSoonContent.useEffect": ()=>{
            const checkMobile = {
                "ComingSoonContent.useEffect.checkMobile": ()=>setIsMobile(window.innerWidth < 768)
            }["ComingSoonContent.useEffect.checkMobile"];
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return ({
                "ComingSoonContent.useEffect": ()=>window.removeEventListener('resize', checkMobile)
            })["ComingSoonContent.useEffect"];
        }
    }["ComingSoonContent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComingSoonContent.useEffect": ()=>{
            const timer = setInterval({
                "ComingSoonContent.useEffect.timer": ()=>{
                    const now = new Date().getTime();
                    const distance = launchDate - now;
                    setCountdown({
                        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                        hours: Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
                        minutes: Math.floor(distance % (1000 * 60 * 60) / (1000 * 60)),
                        seconds: Math.floor(distance % (1000 * 60) / 1000)
                    });
                }
            }["ComingSoonContent.useEffect.timer"], 1000);
            return ({
                "ComingSoonContent.useEffect": ()=>clearInterval(timer)
            })["ComingSoonContent.useEffect"];
        }
    }["ComingSoonContent.useEffect"], [
        launchDate
    ]);
    // Revolutionary mesh gradient effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComingSoonContent.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d', {
                alpha: false
            });
            if (!ctx) return;
            const resize = {
                "ComingSoonContent.useEffect.resize": ()=>{
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }["ComingSoonContent.useEffect.resize"];
            resize();
            window.addEventListener('resize', resize);
            let time = 0;
            const gridSize = isMobile ? 8 : 12;
            const points = [];
            for(let i = 0; i <= gridSize; i++){
                for(let j = 0; j <= gridSize; j++){
                    const x = i / gridSize * canvas.width;
                    const y = j / gridSize * canvas.height;
                    points.push({
                        x,
                        y,
                        baseX: x,
                        baseY: y,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5
                    });
                }
            }
            let animationId;
            const animate = {
                "ComingSoonContent.useEffect.animate": ()=>{
                    time += 0.003;
                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                    gradient.addColorStop(0, '#000000');
                    gradient.addColorStop(0.5, '#0a0a0a');
                    gradient.addColorStop(1, '#000000');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    // Update points
                    points.forEach({
                        "ComingSoonContent.useEffect.animate": (point, i)=>{
                            const waveX = Math.sin(time + point.baseY * 0.002) * 60;
                            const waveY = Math.cos(time + point.baseX * 0.002) * 60;
                            const mouseInfluence = isMobile ? 0 : 150;
                            const dx = mousePos.x * canvas.width - point.baseX;
                            const dy = mousePos.y * canvas.height - point.baseY;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            const force = Math.max(0, 1 - dist / mouseInfluence);
                            point.x = point.baseX + waveX + dx * force * 0.3;
                            point.y = point.baseY + waveY + dy * force * 0.3;
                        }
                    }["ComingSoonContent.useEffect.animate"]);
                    // Draw mesh
                    for(let i = 0; i < gridSize; i++){
                        for(let j = 0; j < gridSize; j++){
                            const idx = i * (gridSize + 1) + j;
                            const p1 = points[idx];
                            const p2 = points[idx + 1];
                            const p3 = points[idx + gridSize + 2];
                            const p4 = points[idx + gridSize + 1];
                            if (!p1 || !p2 || !p3 || !p4) continue;
                            const centerX = (p1.x + p2.x + p3.x + p4.x) / 4;
                            const centerY = (p1.y + p2.y + p3.y + p4.y) / 4;
                            const distFromCenter = Math.sqrt(Math.pow(centerX - canvas.width / 2, 2) + Math.pow(centerY - canvas.height / 2, 2));
                            const maxDist = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2));
                            const intensity = 1 - distFromCenter / maxDist;
                            const hue = (time * 10 + i * 5 + j * 5) % 360;
                            const alpha = intensity * 0.15;
                            const grd = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
                            grd.addColorStop(0, `hsla(${hue}, 70%, 60%, ${alpha})`);
                            grd.addColorStop(1, `hsla(${hue}, 70%, 40%, 0)`);
                            ctx.fillStyle = grd;
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.lineTo(p3.x, p3.y);
                            ctx.lineTo(p4.x, p4.y);
                            ctx.closePath();
                            ctx.fill();
                            // Subtle grid lines
                            ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.03})`;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                    animationId = requestAnimationFrame(animate);
                }
            }["ComingSoonContent.useEffect.animate"];
            animate();
            return ({
                "ComingSoonContent.useEffect": ()=>{
                    cancelAnimationFrame(animationId);
                    window.removeEventListener('resize', resize);
                }
            })["ComingSoonContent.useEffect"];
        }
    }["ComingSoonContent.useEffect"], [
        mousePos,
        isMobile
    ]);
    // Ultra-smooth animations
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComingSoonContent.useEffect": ()=>{
            const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].context({
                "ComingSoonContent.useEffect.ctx": ()=>{
                    const tl = __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline({
                        defaults: {
                            ease: 'power4.out'
                        }
                    });
                    tl.from(containerRef.current, {
                        opacity: 0,
                        duration: 1.5
                    });
                    if (titleRef.current) {
                        const text = titleRef.current.textContent || '';
                        const words = text.split(' ');
                        titleRef.current.innerHTML = words.map({
                            "ComingSoonContent.useEffect.ctx": (word)=>`<span class="word inline-block overflow-hidden"><span class="inner inline-block">${word}</span></span>`
                        }["ComingSoonContent.useEffect.ctx"]).join(' ');
                        tl.from('.word .inner', {
                            yPercent: 100,
                            opacity: 0,
                            stagger: 0.1,
                            duration: 1.2,
                            ease: 'power4.out'
                        }, 0.3);
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].from('.reveal-up', {
                        scrollTrigger: {
                            trigger: '.reveal-up',
                            start: 'top 80%'
                        },
                        y: 60,
                        opacity: 0,
                        stagger: 0.15,
                        duration: 1.2,
                        ease: 'power4.out'
                    });
                }
            }["ComingSoonContent.useEffect.ctx"], containerRef);
            return ({
                "ComingSoonContent.useEffect": ()=>ctx.revert()
            })["ComingSoonContent.useEffect"];
        }
    }["ComingSoonContent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComingSoonContent.useEffect": ()=>{
            if (isMobile) return;
            const handleMove = {
                "ComingSoonContent.useEffect.handleMove": (e)=>{
                    setMousePos({
                        x: e.clientX / window.innerWidth,
                        y: e.clientY / window.innerHeight
                    });
                }
            }["ComingSoonContent.useEffect.handleMove"];
            window.addEventListener('mousemove', handleMove);
            return ({
                "ComingSoonContent.useEffect": ()=>window.removeEventListener('mousemove', handleMove)
            })["ComingSoonContent.useEffect"];
        }
    }["ComingSoonContent.useEffect"], [
        isMobile
    ]);
    const handleSubmit = (e)=>{
        e.preventDefault();
        setSubmitted(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "relative min-h-screen bg-black text-white overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "fixed inset-0 w-full h-full"
            }, void 0, false, {
                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 md:px-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-7xl w-full mx-auto text-center space-y-12 sm:space-y-16 md:space-y-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 rounded-full bg-white animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                            lineNumber: 233,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs sm:text-sm tracking-[0.2em] uppercase font-medium text-white/70",
                                            children: "Launching March 2025"
                                        }, void 0, false, {
                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                            lineNumber: 234,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                    lineNumber: 232,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    ref: titleRef,
                                    className: "text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-none",
                                    children: "MasseurMatch"
                                }, void 0, false, {
                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                    lineNumber: 238,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg sm:text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed",
                                    children: [
                                        "Connect with verified massage therapists.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                            className: "hidden sm:block"
                                        }, void 0, false, {
                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                            lineNumber: 244,
                                            columnNumber: 56
                                        }, this),
                                        "Premium wellness. Simplified."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto",
                                    children: [
                                        {
                                            label: 'Days',
                                            value: countdown.days
                                        },
                                        {
                                            label: 'Hours',
                                            value: countdown.hours
                                        },
                                        {
                                            label: 'Mins',
                                            value: countdown.minutes
                                        },
                                        {
                                            label: 'Secs',
                                            value: countdown.seconds
                                        }
                                    ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "group",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 bg-white/5 rounded-2xl blur-xl"
                                                    }, void 0, false, {
                                                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                        lineNumber: 258,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white/10 transition-colors duration-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extralight tabular-nums mb-2",
                                                                children: String(item.value).padStart(2, '0')
                                                            }, void 0, false, {
                                                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                                lineNumber: 260,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[0.65rem] sm:text-xs text-white/40 uppercase tracking-[0.2em] font-medium",
                                                                children: item.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                                lineNumber: 263,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                        lineNumber: 259,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                lineNumber: 257,
                                                columnNumber: 19
                                            }, this)
                                        }, item.label, false, {
                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                            lineNumber: 256,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, this),
                                !submitted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleSubmit,
                                    className: "max-w-2xl mx-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 bg-white/5 rounded-2xl blur-xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative flex flex-col sm:flex-row gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 hover:bg-white/10 transition-colors duration-500",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            value: email,
                                                            onChange: (e)=>setEmail(e.target.value),
                                                            placeholder: "Enter your email",
                                                            required: true,
                                                            className: "flex-1 px-6 py-4 bg-transparent text-white placeholder-white/30 focus:outline-none text-base sm:text-lg font-light"
                                                        }, void 0, false, {
                                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "submit",
                                                            className: "px-8 py-4 bg-white text-black rounded-xl font-medium text-base sm:text-lg hover:bg-white/90 transition-colors duration-300 whitespace-nowrap",
                                                            children: "Join Waitlist"
                                                        }, void 0, false, {
                                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                            lineNumber: 286,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                            lineNumber: 275,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-4 text-sm text-white/40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white font-medium",
                                                    children: "2,847"
                                                }, void 0, false, {
                                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                    lineNumber: 295,
                                                    columnNumber: 19
                                                }, this),
                                                " people already signed up"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                            lineNumber: 294,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                    lineNumber: 274,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-w-2xl mx-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 bg-white/5 rounded-2xl blur-xl"
                                            }, void 0, false, {
                                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                lineNumber: 301,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-8 h-8",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M5 13l4 4L19 7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                                lineNumber: 305,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                            lineNumber: 304,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                        lineNumber: 303,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-2xl font-light mb-3",
                                                        children: "You're on the list"
                                                    }, void 0, false, {
                                                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                        lineNumber: 308,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-white/60",
                                                        children: "We'll notify you when we launch"
                                                    }, void 0, false, {
                                                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                lineNumber: 302,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                        lineNumber: 300,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                    lineNumber: 299,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-24 sm:py-32 md:py-40 px-6 sm:px-8 md:px-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-7xl mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-3xl sm:text-4xl md:text-5xl font-light text-center mb-16 sm:mb-20 md:mb-24",
                                    children: "Premium Wellness Platform"
                                }, void 0, false, {
                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                    lineNumber: 320,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8",
                                    children: [
                                        {
                                            title: 'AI Matching',
                                            desc: 'Smart algorithms find your perfect therapist'
                                        },
                                        {
                                            title: 'Instant Booking',
                                            desc: 'Real-time availability and confirmation'
                                        },
                                        {
                                            title: 'Verified Pros',
                                            desc: 'Licensed and background-checked experts'
                                        },
                                        {
                                            title: 'Direct Chat',
                                            desc: 'Connect and discuss your wellness goals'
                                        }
                                    ].map((feature, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "reveal-up group",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 mb-6 rounded-xl bg-white/10 flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-6 h-6 rounded-full bg-white/20"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                                    lineNumber: 336,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                                lineNumber: 335,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-xl font-medium mb-3",
                                                                children: feature.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                                lineNumber: 338,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-white/60 text-sm leading-relaxed font-light",
                                                                children: feature.desc
                                                            }, void 0, false, {
                                                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                                lineNumber: 339,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                lineNumber: 332,
                                                columnNumber: 19
                                            }, this)
                                        }, i, false, {
                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                            lineNumber: 331,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                    lineNumber: 324,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                            lineNumber: 319,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-24 sm:py-32 md:py-40 px-6 sm:px-8 md:px-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-5xl mx-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-white/5 rounded-3xl blur-2xl"
                                    }, void 0, false, {
                                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                        lineNumber: 352,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 sm:p-16 md:p-20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16",
                                            children: [
                                                {
                                                    value: '500+',
                                                    label: 'Verified Therapists'
                                                },
                                                {
                                                    value: '10+',
                                                    label: 'Major Cities'
                                                },
                                                {
                                                    value: '100%',
                                                    label: 'Premium Quality'
                                                }
                                            ].map((stat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "reveal-up text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-5xl sm:text-6xl md:text-7xl font-extralight mb-4",
                                                            children: stat.value
                                                        }, void 0, false, {
                                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                            lineNumber: 361,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-white/60 text-sm uppercase tracking-[0.2em] font-medium",
                                                            children: stat.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                            lineNumber: 362,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                            lineNumber: 354,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                        lineNumber: 353,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                                lineNumber: 351,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                            lineNumber: 350,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-12 px-6 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-white/30 text-sm",
                            children: "© 2025 MasseurMatch. All rights reserved."
                        }, void 0, false, {
                            fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                            lineNumber: 373,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                        lineNumber: 372,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/masseurmatch-nextjs/components/ComingSoon.tsx",
        lineNumber: 223,
        columnNumber: 5
    }, this);
}
_s(ComingSoonContent, "pvIDxCm2RHWhwE24mNLX63ZQRqU=");
_c = ComingSoonContent;
var _c;
__turbopack_context__.k.register(_c, "ComingSoonContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=masseurmatch-nextjs_components_ComingSoon_tsx_c0461884._.js.map