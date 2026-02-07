FROM node:18-alpine AS base

# Install dependencies based on the prefered package manager
RUN corepack enable pnpm && corepack prepare pnpm --all || true

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Set the default command
CMD ["npm", "start"]
