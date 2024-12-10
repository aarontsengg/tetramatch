# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files first to take advantage of build caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the project if needed (for TypeScript, for instance)
RUN npm run build

# Set the command to start your application
CMD ["npm", "start"]

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000
