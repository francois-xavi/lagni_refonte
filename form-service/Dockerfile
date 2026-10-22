FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.mjs ./
# /data holds forms.db + uploaded CVs; mount a persistent volume here.
RUN mkdir /data && chown node:node /data
ENV DATA_DIR=/data
USER node
EXPOSE 3000
CMD ["node", "--disable-warning=ExperimentalWarning", "server.mjs"]
