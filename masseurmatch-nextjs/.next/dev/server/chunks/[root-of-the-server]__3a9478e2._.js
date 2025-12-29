module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
// proxy.ts - SEO & Security Control + Auth Protection
// NOTE: Next.js treats this file as the sole middleware entrypoint. Do not add
// middleware.ts alongside this file, or Next will fail with a duplicate
// middleware/proxy error.
var __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/masseurmatch-nextjs/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware] (ecmascript)");
;
;
// ====================================
// BLOCKED COUNTRIES (ISO 3166-1 alpha-2)
// ====================================
// Reasons: Anti-LGBTQ+ laws, US sanctions, high fraud/trafficking risk
const BLOCKED_COUNTRIES = new Set([
    // Severe anti-LGBTQ+ laws (death penalty or life imprisonment)
    "IR",
    "SA",
    "AF",
    "BN",
    "NG",
    "MR",
    "YE",
    "SO",
    "SD",
    "UG",
    // US Sanctions
    "RU",
    "KP",
    "CU",
    "SY",
    // High trafficking/fraud risk
    "MM"
]);
// ====================================
// PROTECTED ROUTES (Require Authentication)
// ====================================
const PROTECTED_ROUTES = [
    "/dashboard",
    "/edit-profile"
];
const NOINDEX_ROUTES = [
    "/login",
    "/join/form",
    "/recuperar",
    "/dashboard",
    "/edit-profile",
    "/pending",
    "/checkout",
    "/admin"
];
const LEGAL_REDIRECTS = {
    "/terms": "/legal/terms",
    "/privacy-policy": "/legal/privacy-policy",
    "/community-guidelines": "/legal/community-guidelines",
    "/cookie-policy": "/legal/cookie-policy",
    "/professional-standards": "/legal/professional-standards",
    "/anti-trafficking": "/legal/anti-trafficking"
};
function normalizePath(pathname) {
    if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
    return pathname;
}
async function proxy(req) {
    const pathname = normalizePath(req.nextUrl.pathname);
    // Shared response instance so that any cookies set during auth are preserved
    // for the rest of the middleware chain.
    let res = __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request: {
            headers: req.headers
        }
    });
    // ====================================
    // AUTH PROTECTION (Protected Routes)
    // ====================================
    const isProtectedRoute = PROTECTED_ROUTES.some((route)=>pathname === route || pathname.startsWith(`${route}/`));
    if (isProtectedRoute) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseAnonKey, {
            cookies: {
                get (name) {
                    return req.cookies.get(name)?.value;
                },
                set (name, value, options) {
                    res.cookies.set({
                        name,
                        value,
                        ...options
                    });
                },
                remove (name, options) {
                    res.cookies.set({
                        name,
                        value: "",
                        ...options
                    });
                }
            }
        });
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = "/login";
            redirectUrl.searchParams.set("redirectTo", `${pathname}${req.nextUrl.search}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
        }
    }
    // ====================================
    // GEO-BLOCKING (Country Restriction)
    // ====================================
    // Skip geo-blocking for the blocked page itself to avoid redirect loop
    if (pathname !== "/blocked") {
        // Vercel automatically provides country code via x-vercel-ip-country header.
        // In some environments `req.geo` is present but not typed, so we cast safely.
        const geoCountry = req.geo?.country;
        const country = req.headers.get("x-vercel-ip-country") || geoCountry;
        if (country && BLOCKED_COUNTRIES.has(country)) {
            const blockedUrl = req.nextUrl.clone();
            blockedUrl.pathname = "/blocked";
            return __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(blockedUrl);
        }
    }
    // ====================================
    // BYPASS WAITLIST (Vercel rewrites)
    // ====================================
    // IMPORTANT: This must be before any redirects/headers logic
    if (pathname === "/waitlist" || pathname.startsWith("/waitlist/")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // ====================================
    // 301 REDIRECTS - Legal Pages Migration
    // ====================================
    const legalTarget = LEGAL_REDIRECTS[pathname];
    if (legalTarget) {
        const newUrl = req.nextUrl.clone();
        newUrl.pathname = legalTarget;
        return __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(newUrl, 301);
    }
    // ====================================
    // FORCE WWW (SEO Best Practice) - proxy-safe
    // ====================================
    const forwardedHost = req.headers.get("x-forwarded-host");
    const host = forwardedHost ?? req.headers.get("host");
    if (host && !host.startsWith("www.") && !host.includes("localhost") && !host.includes("vercel.app")) {
        const newUrl = req.nextUrl.clone();
        newUrl.host = `www.${host}`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$masseurmatch$2d$nextjs$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(newUrl, 301);
    }
    // ====================================
    // RESPONSE (headers)
    // ====================================
    // ====================================
    // NOINDEX ROUTES (Private/User Areas)
    // ====================================
    if (NOINDEX_ROUTES.some((route)=>pathname.startsWith(route))) {
        res.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    // ====================================
    // SECURITY HEADERS
    // ====================================
    // Prevent clickjacking
    res.headers.set("X-Frame-Options", "DENY");
    // Prevent MIME type sniffing
    res.headers.set("X-Content-Type-Options", "nosniff");
    // Referrer Policy
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    // HSTS (only meaningful on HTTPS; safe to set in production)
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    // Permissions Policy (hardening)
    res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    // Basic CSP (adjust if you use external scripts like Stripe/GTM etc.)
    res.headers.set("Content-Security-Policy", [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "img-src 'self' data: https:",
        "font-src 'self' data: https:",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "connect-src 'self' https: wss:",
        "upgrade-insecure-requests"
    ].join("; "));
    return res;
}
const config = {
    matcher: [
        /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - robots.txt / sitemap.xml (SEO files)
     * - common static assets
     */ "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3a9478e2._.js.map