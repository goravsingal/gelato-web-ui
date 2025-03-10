# Use Node.js 20 as the base image
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire Next.js project
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ARBITRUM_CONTRACT
ARG NEXT_PUBLIC_OPTIMISM_CONTRACT

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ARBITRUM_CONTRACT=$NEXT_PUBLIC_ARBITRUM_CONTRACT
ENV NEXT_PUBLIC_OPTIMISM_CONTRACT=$NEXT_PUBLIC_OPTIMISM_CONTRACT

# Build the Next.js app for production
RUN npm run build

# RUN STAGE
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only required files from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3000
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
