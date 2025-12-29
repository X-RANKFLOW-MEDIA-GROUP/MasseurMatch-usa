(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/masseurmatch-nextjs/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase,
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/masseurmatch-nextjs/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/masseurmatch-nextjs/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://ijsdpozjfjjufjsoexod.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqc2Rwb3pqZmpqdWZqc29leG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDcxNTYsImV4cCI6MjA3NzU4MzE1Nn0.S6fGMlOp8KLHwPGL9ebOQvDUqY3C79bw3SH9IOsCi2M");
const supabaseServiceKey = __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.SUPABASE_SERVICE_ROLE_KEY;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceKey ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
}) : null;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/masseurmatch-nextjs/components/CityLandingPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CityLandingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/masseurmatch-nextjs/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/masseurmatch-nextjs/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/masseurmatch-nextjs/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function CityLandingPage({ city, segment }) {
    _s();
    const [therapists, setTherapists] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CityLandingPage.useEffect": ()=>{
            async function fetchTherapists() {
                setLoading(true);
                // Base query: get therapists in this city
                let query = __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('therapists').select('user_id, slug, display_name, headline, city, state, rating, profile_photo, services').ilike('city', city.name) // Case-insensitive match
                .eq('status', 'active').order('rating', {
                    ascending: false
                }).limit(50);
                // If segment filter is provided, filter by service
                if (segment) {
                    // This assumes your services column contains the segment name
                    // Adjust based on your actual database structure
                    const serviceKeyword = segment.slug.replace(/-/g, ' ');
                    query = query.contains('services', [
                        serviceKeyword
                    ]);
                }
                const { data, error } = await query;
                if (!error && data) {
                    setTherapists(data);
                }
                setLoading(false);
            }
            fetchTherapists();
        }
    }["CityLandingPage.useEffect"], [
        city,
        segment
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "city-landing-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: segment ? `${segment.slug.replace(/-/g, ' ')} in ${city.name}${city.state ? `, ${city.state}` : ''}` : `Massage Therapists in ${city.name}${city.state ? `, ${city.state}` : ''}`
                    }, void 0, false, {
                        fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    segment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "narrative",
                        children: segment.narrative(city.name)
                    }, void 0, false, {
                        fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stats",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: loading ? 'Loading...' : `Found ${therapists.length} therapist${therapists.length !== 1 ? 's' : ''}`
                }, void 0, false, {
                    fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "loading",
                children: "Loading therapists..."
            }, void 0, false, {
                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this) : therapists.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "no-results",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        "No therapists found in ",
                        city.name,
                        segment && ` for ${segment.slug.replace(/-/g, ' ')}`,
                        "."
                    ]
                }, void 0, true, {
                    fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                    lineNumber: 90,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "therapist-grid",
                children: therapists.map((therapist)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `/therapist/${therapist.slug}`,
                        className: "therapist-card",
                        children: [
                            therapist.profile_photo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: therapist.profile_photo,
                                alt: therapist.display_name,
                                className: "profile-photo"
                            }, void 0, false, {
                                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                                lineNumber: 101,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: therapist.display_name
                            }, void 0, false, {
                                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                                lineNumber: 107,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "headline",
                                children: therapist.headline
                            }, void 0, false, {
                                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                                lineNumber: 108,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "meta",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "⭐ ",
                                            therapist.rating
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                                        lineNumber: 110,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "📍 ",
                                            therapist.city,
                                            ", ",
                                            therapist.state
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                                        lineNumber: 111,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                                lineNumber: 109,
                                columnNumber: 15
                            }, this),
                            therapist.services && therapist.services.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "services",
                                children: therapist.services.slice(0, 3).map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "service-badge",
                                        children: service
                                    }, service, false, {
                                        fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                                        lineNumber: 116,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                                lineNumber: 114,
                                columnNumber: 17
                            }, this)
                        ]
                    }, therapist.user_id, true, {
                        fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                        lineNumber: 95,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this),
            city.neighbors && city.neighbors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "neighbors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Nearby Areas"
                    }, void 0, false, {
                        fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "neighbor-links",
                        children: city.neighbors.map((neighborSlug)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: `/city/${neighborSlug}`,
                                children: neighborSlug.replace(/-/g, ' ')
                            }, neighborSlug, false, {
                                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                                lineNumber: 133,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                        lineNumber: 131,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
                lineNumber: 129,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/masseurmatch-nextjs/components/CityLandingPage.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(CityLandingPage, "iia84dm51vwYambD1c0NRmND1wc=");
_c = CityLandingPage;
var _c;
__turbopack_context__.k.register(_c, "CityLandingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=masseurmatch-nextjs_85b67ad6._.js.map