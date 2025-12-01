FROM node:20

WORKDIR /usr/src/app

COPY package.json ./

EXPOSE 3000

CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]
