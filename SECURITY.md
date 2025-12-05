# Security Configuration

To ensure the security of the MasseurMatch Legal Center, please configure your deployment platform (Vercel, Netlify, or Nginx) with the following HTTP headers.

## Recommended Security Headers

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://images.unsplash.com; connect-src 'self' https://api.masseurmatch.com;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Next.js Configuration (next.config.js)

If you are using Next.js, add these headers to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

## Environment Protection

Ensure that indexing is disabled for staging environments by checking the hostname or environment variable.

**robots.txt logic:**
```
User-agent: *
Disallow: /
```
(Apply this only on `*.vercel.app` or staging domains)
