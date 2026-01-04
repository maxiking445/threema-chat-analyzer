# ====== STAGE 1: Build Go Binary ======
FROM golang:1.23-alpine AS builder
WORKDIR /app

COPY bff-api/go.mod bff-api/go.sum ./
RUN go mod download

COPY bff-api/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o /myapp .

# ====== STAGE 2: Build Vue Frontend ======
FROM node:22-alpine AS vue-builder
WORKDIR /app

COPY analyzer-frontend/package*.json ./
RUN npm install

COPY analyzer-frontend/ .
RUN npm run build

# ====== STAGE 3: Runtime ======
FROM alpine:latest

RUN apk add --no-cache nginx ca-certificates
RUN mkdir -p /run/nginx

COPY --from=builder /myapp /myapp
COPY --from=vue-builder /app/dist /usr/share/nginx/html
COPY analyzer-frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 8080

CMD sh -c "/myapp & nginx -g 'daemon off;'"
