FROM node:22-alpine

WORKDIR /srv/www/apostrophe

RUN chown -R node: /srv/www/apostrophe
USER node

COPY --chown=node package*.json /srv/www/apostrophe/

ENV NODE_ENV=production
RUN npm ci

COPY --chown=node . /srv/www/apostrophe/

RUN npm run build 2>/dev/null || node app @apostrophecms/asset:build

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "app.js"]
