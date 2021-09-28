FROM node:14.17.3-alpine as dev

WORKDIR /app

# Build Server
COPY package.json . 
RUN yarn

COPY . .

ENV NODE_ENV=production
RUN yarn build
RUN yarn --production

# Build Dashboard
ENV PUBLIC_URL=/_/dashboard
ENV NODE_ENV=development
RUN cd ui && npm i
RUN cd ui && npm run build

FROM node:14.17.3-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --from=dev /app/package.json /app/package.json
COPY --from=dev /app/lib/ /app/lib
COPY --from=dev /app/ui/build /app/ui/build
COPY --from=dev /app/node_modules /app/node_modules

CMD [ "yarn", "start" ]