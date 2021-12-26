# pull official base image
FROM node:14-alpine

# set working directory
WORKDIR /usr/app

# install app dependencies
COPY package.json yarn.lock ./
RUN yarn

# add app
COPY . ./

# start app
CMD ["yarn", "start"]