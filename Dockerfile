FROM node:8-alpine

# directory for the app

RUN mkdir -p /opt/app

# defaults to production so that npm install only installs production npm
# packages; however, the docker-compose build sets it to development so that
# the required dev packages are installed during development

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ENV PATH /opt/node_modules/.bin:$PATH

# intentally not installing node_modules inside the /opt/app dir; this makes
# for a better experience when using image in development environment

ADD package*.json /opt/
RUN cd /opt/app && npm install && npm cache clean --force

ADD ./ /opt/app

WORKDIR /opt/app
CMD [ "node", "index.js" ]