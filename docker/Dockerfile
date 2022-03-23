FROM node

WORKDIR /home/app
COPY . /home/app

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start:prod" ]