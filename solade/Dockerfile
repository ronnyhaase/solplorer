FROM node:lts AS build
WORKDIR /usr/app-src
COPY . /usr/app-src/
RUN npm install
RUN npm run build
COPY ./package* /usr/app-src/dist/
RUN cd /usr/app-src/dist/ && npm ci --only=production

FROM node:lts-alpine@sha256:28bed508446db2ee028d08e76fb47b935defa26a84986ca050d2596ea67fd506
RUN apk add dumb-init
ENV NODE_ENV production
USER node
WORKDIR /usr/app
COPY --chown=node:node --from=build /usr/app-src/dist/ /usr/app/
CMD ["dumb-init", "node", "main"]
