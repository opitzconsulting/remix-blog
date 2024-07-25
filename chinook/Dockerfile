# base node image
FROM node:20.13.1-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as build

WORKDIR /myapp

ADD . .
RUN yarn set version stable && yarn install
RUN yarn build

# Final image
FROM base

ENV PORT="8080"
ENV NODE_ENV="production"

WORKDIR /myapp

COPY --from=build /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/yarn.lock /myapp/yarn.lock
COPY --from=build /myapp/.yarnrc.yml /myapp/.yarnrc.yml
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/.yarn /myapp/.yarn
COPY --from=build /myapp/start.sh /myapp/start.sh

RUN chmod +x /myapp/start.sh

ENTRYPOINT ["./start.sh"]
