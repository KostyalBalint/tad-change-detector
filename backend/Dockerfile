FROM node:14-alpine
WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn
#In dockerignore we defined the node_modules folder
COPY . ./

ENV PORT=80
CMD ["yarn", "dev"]
