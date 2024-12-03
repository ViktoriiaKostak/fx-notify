FROM node:20.10.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

npx prisma migrate dev --name init

CMD ["npm", "run", "start:dev"]