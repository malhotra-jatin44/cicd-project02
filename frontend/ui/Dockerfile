# ---- BUILD STAGE ----
FROM node:18 as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# ---- RUNTIME STAGE ----
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy React build
COPY --from=build /app/build .

# Copy template config
COPY public/config.template.js /usr/share/nginx/html/config.template.js

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
