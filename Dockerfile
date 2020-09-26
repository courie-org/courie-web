# build environment
FROM node:13.12.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV NO_UPDATE_NOTIFIER true
COPY package.json ./
COPY package-lock.json ./
RUN npm install 
COPY . ./
EXPOSE 3000
CMD ["npm", "start"]