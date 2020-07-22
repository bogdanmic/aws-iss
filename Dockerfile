FROM node:12.18.2-alpine

LABEL maintainer="Bogdan Mic <mic.bogdan@gmail.com>"

WORKDIR /app
COPY package.json package-lock.json /app/
ENV NODE_ENV=production
RUN npm install --production

COPY config config
COPY src src

CMD ["node", "src/server.js"]