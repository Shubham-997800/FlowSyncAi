FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
ENV VITE_API_URL=http://localhost:5000
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
