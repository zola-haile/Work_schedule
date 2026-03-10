FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]

# docker build -t careerdesk .
# docker run -p 3000:3000 careerdesk
