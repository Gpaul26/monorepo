#  We are using the latest Node.js distribution with Long Term Support (LTS) as of 11/04/2020.
FROM node:16.13

# Create app directory
WORKDIR /dist

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Includes app source
COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]
