# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN npm install -g pnpm && pnpm install

# Copy the rest of the app code
COPY . .

# Build the app
RUN pnpm run build

# Expose the app port
EXPOSE 3000

# Run the app in production
CMD ["pnpm", "run", "start:prod"]