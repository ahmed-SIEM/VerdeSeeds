FROM node:16 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copy environment files first
COPY .env . 
COPY src/environments/fireBaseEnv.ts src/environments/

COPY . .
RUN npm run build --configuration=production

FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=build /usr/src/app/dist/portal /usr/share/nginx/html

# Copy nginx configuration if you have custom config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
