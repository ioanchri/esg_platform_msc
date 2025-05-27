
# Use node alpine image as the base image
FROM node:20-alpine as angular
# Set the working directory
WORKDIR /ng-app
# Add the source code to app & Install dependencies
COPY package*.json .
RUN npm install -g @angular/cli
RUN npm install --legacy-peer-deps
COPY . .
# Generate the build of the application
RUN npm run build
# Use Nginx alpine server 
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=angular /ng-app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80