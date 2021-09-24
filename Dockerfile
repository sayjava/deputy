FROM node:14.17.3-alpine as dev

WORKDIR /app

# Build Server
COPY package.json . 
RUN yarn

COPY . .

ENV NODE_ENV=production
RUN yarn build
RUN yarn --production

FROM node:14.17.3-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --from=dev /app/package.json /app/package.json
COPY --from=dev /app/lib/ /app/lib
COPY --from=dev /app/node_modules /app/node_modules

CMD [ "yarn", "start" ]