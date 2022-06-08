FROM node:16@sha256:59eb4e9d6a344ae1161e7d6d8af831cb50713cc631889a5a8c2d438d6ec6aa0f AS build
WORKDIR /usr/app-src
COPY . /usr/app-src/
RUN npm ci --only=production

# TODO: 16-alpine crashes without errors, try to fix
FROM node:16@sha256:59eb4e9d6a344ae1161e7d6d8af831cb50713cc631889a5a8c2d438d6ec6aa0f
# RUN apk add dumb-init
RUN apt update
RUN apt install dumb-init
ENV NODE_ENV production
USER node
WORKDIR /usr/app
COPY --chown=node:node --from=build /usr/app-src/ /usr/app/
CMD ["dumb-init", "node", "src/index.js"]
