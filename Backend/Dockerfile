# Backend Dockerfile
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY src ./src
COPY scripts ./scripts

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application and necessary files
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Note: For production, use environment variables instead of .env file
# The .env file should not be copied to production for security reasons

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Create logs directory
RUN mkdir -p logs && chown -R nextjs:nodejs logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http=require('http');const req=http.request({hostname:'localhost',port:5000,path:'/'},res=>{process.exit(res.statusCode===200?0:1)});req.on('error',()=>process.exit(1));req.end();"

# Start the application
CMD ["node", "dist/index.js"]
