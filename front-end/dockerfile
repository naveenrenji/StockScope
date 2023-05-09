# Use an official Node.js runtime as a parent image
FROM node:19.3.0-alpine

# Set the working directory to /app
WORKDIR /front-end

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the remaining code to the container
COPY . .

# Build the app
RUN npm run build

# Set the command to start the server
CMD ["npm", "start"]
