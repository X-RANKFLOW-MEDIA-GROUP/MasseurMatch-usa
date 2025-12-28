# =============================================================================
# Multi-Stage Dockerfile for Next.js Production
# Enterprise-Grade: Optimized, Secure, Minimal
# Target Size: < 200MB
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies Installation (Base)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies only when needed
# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with clean install for reproducibility
RUN npm ci --legacy-peer-deps --omit=dev && \
    npm cache clean --force

# -----------------------------------------------------------------------------
# Stage 2: Builder
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Production Runtime (Final Stage)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start Next.js
CMD ["node", "server.js"]
