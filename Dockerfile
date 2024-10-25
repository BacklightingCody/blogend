FROM node:21.7.3-alpine3.20
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm 
COPY prisma ./prisma/
RUN pnpm install
RUN npx prisma generate
COPY . .
RUN pnpm run build
EXPOSE 7000
CMD ["npm", "run", "start:dev"]