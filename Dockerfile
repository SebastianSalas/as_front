# Pull official base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Add /app/node_modules/.bin to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
RUN apk add --no-cache git
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Add app
COPY . ./

# Start app
CMD ["npm", "run", "dev"]