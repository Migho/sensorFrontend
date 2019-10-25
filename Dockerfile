FROM node:10

ENV LC_ALL=C.UTF-8 

COPY . .
RUN npm install

CMD ["npm", "start"]