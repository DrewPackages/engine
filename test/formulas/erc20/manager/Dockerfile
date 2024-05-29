FROM node:18 as build
WORKDIR /app
COPY package*.json /app
RUN npm install
ARG VITE_RPC_URL
COPY . /app
RUN npm run build

FROM nginx as runtime
COPY --from=build /app/dist /usr/share/nginx/html
