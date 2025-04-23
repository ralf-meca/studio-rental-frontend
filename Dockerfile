# --- Stage 1: Build React App ---
FROM node:20.16-alpine AS builder

WORKDIR /studio-rental-frontend

# Copy only the Yarn dependencies files first for better cache
COPY package.json yarn.lock ./

# Install deps with yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Fix esbuild binary mismatch (optional, if you're using esbuild)
RUN yarn add --force esbuild

RUN yarn tsc --showConfig

# Build the React app
RUN yarn build

# --- Stage 2: Serve with Nginx ---
FROM nginx:stable-alpine

# Copy built static files
COPY --from=builder /studio-rental-frontend/dist /usr/share/nginx/html

# Copy your Nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
