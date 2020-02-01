# Use a lighter version of Node as a parent image
FROM node

# Set the working directory to /backend
RUN mkdir -p /usr/src/app/client
WORKDIR /usr/src/app/client

# copy package.json into the container at /backend
COPY package*.json /usr/src/app/client/

# install dependencies
RUN npm install
RUN npm audit fix 
# Copy the current directory contents into the container at /client
COPY . /usr/src/app/client/

# Make port 3000 available to the world outside this container
EXPOSE 80

# Run the app when the container launches
CMD ["npm", "start"]
