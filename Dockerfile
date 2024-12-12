# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY src ./src

# Install TypeScript globally if not already installed
RUN npm install -g typescript

# Install @types/redis
RUN npm install --save-dev @types/redis

# Build TypeScript files
RUN tsc

# Expose backend port
EXPOSE 4000

# Start the backend server
CMD ["node", "dist/index.js"]
