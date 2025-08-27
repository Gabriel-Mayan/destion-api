FROM node:lts-alpine

RUN mkdir -p /app/api
WORKDIR /app/api

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start:prod"]
