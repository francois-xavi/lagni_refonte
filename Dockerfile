# The website: Astro in server mode, run by Node.
#
# It used to be a static build served by nginx. Since content comes from the
# CMS per request, there is a process to run — nginx is still in front, but as
# a reverse proxy (see nginx.conf), not as the thing serving the pages.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Only what the server needs: production dependencies and the build output.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

# The node adapter serves the hashed client assets from dist/client itself, so
# there is nothing to copy into nginx.
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

USER node
CMD ["node", "./dist/server/entry.mjs"]
