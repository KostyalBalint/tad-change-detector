FROM node:14-alpine
WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn
#In dockerignore we defined the node_modules folder
COPY . ./
CMD ["yarn", "dev"]
