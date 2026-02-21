FROM node:22-alpine AS vue-builder
WORKDIR /app

COPY analyzer-frontend/package*.json ./
RUN npm install

COPY analyzer-frontend/ .
RUN npm run build

FROM alpine:latest
WORKDIR /app

RUN apk add --no-cache nginx ca-certificates
RUN mkdir -p /run/nginx

COPY --from=vue-builder /app/dist /usr/share/nginx/html
COPY analyzer-frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD nginx -g 'daemon off;'