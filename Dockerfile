# Use a base image with Node.js pre-installed
FROM node:19

# Set the working directory for back-end
WORKDIR /back-end

# Copy the package.json and package-lock.json files for the back-end
COPY ./back-end .

# Install back-end dependencies
RUN npm install

# Set the working directory for front-end
WORKDIR /front-end

# Copy the package.json and package-lock.json files for the front-end
COPY ./front-end .

# Install front-end dependencies
RUN npm install

# Copy the rest of the back-end and front-end code
COPY . .

# Build the front-end application
RUN cd front-end && npm run build

# Expose the necessary ports
EXPOSE 3000

# Set the command to start your application
CMD [ "npm", "start" ]
