FROM node:20-alpine

WORKDIR /app

# Install tar and gzip for package streaming
RUN apk add --no-cache tar gzip

# Copy package files
COPY package.json ./

# Copy runtime manifests, server and scripts
COPY server.js ./
COPY manifests/ ./manifests/
COPY scripts/ ./scripts/
COPY licenses/ ./licenses/
COPY install.sh README.md API.md LIBRARY_AUDIT.md ./

# Copy extracted language runtimes
COPY c_cpp/ ./c_cpp/
COPY java/ ./java/
COPY python/ ./python/
COPY nodejs/ ./nodejs/
COPY go/ ./go/
COPY rust/ ./rust/
COPY kotlin/ ./kotlin/
COPY csharp/ ./csharp/
COPY php/ ./php/
COPY ruby/ ./ruby/
COPY lua/ ./lua/

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "server.js"]
