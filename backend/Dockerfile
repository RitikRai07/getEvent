# ==========================================================
# TicketCharge Hub - Backend Dockerfile
# Node.js + Express + MongoDB
# ==========================================================

# ---- Stage 1: Install dependencies ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy backend source code
COPY . .

# ---- Stage 2: Production image ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy everything from builder
COPY --from=builder /app .

# Create uploads folder (for event images)
RUN mkdir -p public/uploads

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Expose backend port
EXPOSE 5050

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:5050/api/health || exit 1

# Start the Node.js server
CMD ["node", "server.js"]
