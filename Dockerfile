# ==========================================================
# TicketCharge Hub - Frontend Dockerfile
# React + Vite + TypeScript → Nginx
# ==========================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better Docker cache)
COPY package*.json ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Copy all source code
COPY . .

# Build the React app (output goes to /app/dist)
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:1.25-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
