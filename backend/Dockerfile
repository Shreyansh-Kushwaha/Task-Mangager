# Use Node LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose backend port
EXPOSE 1393

# Use environment variables from docker-compose
CMD ["npm", "run", "dev"]
