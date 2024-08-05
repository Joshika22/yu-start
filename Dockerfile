# Use an official Node.js runtime as the base image
FROM node:20.13.1-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install
RUN apt-get update -y && apt-get install -y openssl

# Copy the rest of the app source code to the working directory
COPY . .
RUN npx prisma generate
# Build the Svelte app
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Define the command to run the app
CMD [ "node", "./build/" ]