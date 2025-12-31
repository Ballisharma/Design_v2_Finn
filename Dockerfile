# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Pass build-time arguments (Vite needs these to bake them into the JS)
ARG VITE_WORDPRESS_URL
ARG VITE_WC_CONSUMER_KEY
ARG VITE_WC_CONSUMER_SECRET

ENV VITE_WORDPRESS_URL=$VITE_WORDPRESS_URL
ENV VITE_WC_CONSUMER_KEY=$VITE_WC_CONSUMER_KEY
ENV VITE_WC_CONSUMER_SECRET=$VITE_WC_CONSUMER_SECRET

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
