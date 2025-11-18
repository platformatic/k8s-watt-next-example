FROM node:22-alpine

ENV APP_HOME=/home/app
ENV PORT=3042
ENV PLT_SERVER_LOGGER_LEVEL="info"
ENV PLT_NEXT_WORKERS="1"
ENV PLT_VALKEY_HOST="valkey"

RUN npm install -g pnpm
WORKDIR $APP_HOME
COPY ./ ./

RUN pnpm install && pnpm run build
EXPOSE 3042

CMD [ "pnpm", "run", "start" ]