FROM node:alpine as build
# Set the working directory to /backend
RUN mkdir -p /usr/src/app/client
WORKDIR /usr/src/app/client

COPY package*.json /usr/src/app/client/


# WORKDIR /client
# COPY package.json yarn.lock ./
# copy package.json into the container at /backend
# COPY package*.json /usr/src/app/client/

# # install dependencies
# RUN npm install npm@5 --verbose
RUN npm install

# # Copy the current directory contents into the container at /client
COPY . /usr/src/app/client/
RUN npm run build
# # Make port 3000 available to the world outside this container
# EXPOSE 80

# # Run the app when the container launches
# CMD ["npm", "start"]


# RUN yarn
# COPY ./public ./public
# COPY ./src ./src
# # ENV REACT_APP_baseAPIURL=<backend-app-service-ip>:<port>
# RUN yarn build


### STAGE 2: Production Environment ###
FROM nginx:1.13.12-alpine
COPY --from=build /usr/src/app/client/build/ /usr/share/nginx/html
# --------- only for those using react router ----------
# if you are using react router 
# you need to overwrite the default nginx configurations
# remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
# replace with custom one
COPY nginx/nginx.conf /etc/nginx/conf.d
# --------- /only for those using react router ----------

# Set permissions so nginx can serve it
RUN chown nginx.nginx /usr/share/nginx/html/ -R
# expose port 80 to the outer world
EXPOSE 80
# start nginx 
CMD ["nginx", "-g", "daemon off;"]