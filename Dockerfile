# ====== STAGE 1: Build Vue Frontend ======
FROM node:22-alpine AS vue-builder
WORKDIR /app

COPY analyzer-frontend/package*.json ./
RUN npm install

COPY analyzer-frontend/ .
RUN npm run build

# ====== STAGE 2: Runtime ======
FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache nginx ca-certificates
RUN mkdir -p /run/nginx

COPY --from=builder /myapp /myapp
COPY --from=builder /app/placeholder /app/placeholder
COPY --from=vue-builder /app/dist /usr/share/nginx/html
COPY analyzer-frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 8080

CMD sh -c "/myapp & nginx -g 'daemon off;'"
