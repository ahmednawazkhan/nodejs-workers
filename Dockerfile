FROM node:14-alpine

WORKDIR /home/task
COPY package*.json ./
COPY . .
RUN npm ci

CMD ["npm", "run", "start:docker:prod"]
