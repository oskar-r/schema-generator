FROM node:lts-alpine as build-stage
WORKDIR /app
# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project root files
COPY server/*.* ./server/

#make sure that there is a schema else fail
COPY schema.ts ./
# cope src dir

# build app for production with minification
RUN npm run build:server

ENTRYPOINT [ "node", "app/server/graphqlServer.js"]
