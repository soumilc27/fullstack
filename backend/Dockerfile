FROM node:20-alpine

WORKDIR /app

# Install backend deps
COPY backend/package*.json ./
RUN npm ci --only=production --no-audit --no-fund

# Copy backend source
COPY backend/. ./

# Copy frontend to be served statically by Express (already configured)
COPY frontend/. ../frontend/

# Environment
ENV PORT=4000
EXPOSE 4000

# Default to in-memory Mongo if no MONGO_URI provided
CMD ["/bin/sh","-lc","node src/server.js"]


