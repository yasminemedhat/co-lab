# Use a lighter version of Node as a parent image
FROM node

# Set the working directory to /backend
RUN mkdir -p /usr/src/app/server
WORKDIR /usr/src/app/server

# copy package.json into the container at /backend
COPY package*.json /usr/src/app/server/

# install dependencies
RUN npm install
RUN npm audit fix --force
# Copy the current directory contents into the container at /backend
COPY . /usr/src/app/server/

# Make port 80 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]
