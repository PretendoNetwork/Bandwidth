# syntax=docker/dockerfile:1

ARG app_dir="/home/node/app"


# * Base Node.js image
FROM node:20-alpine AS base
ARG app_dir
WORKDIR ${app_dir}
RUN apk add --no-cache python3 make gcc g++

# * Installing production dependencies
FROM base AS dependencies

RUN --mount=type=bind,source=package.json,target=package.json \
	--mount=type=bind,source=package-lock.json,target=package-lock.json \
	--mount=type=cache,target=/root/.npm \
	npm ci --omit=dev


# * Installing development dependencies and building the application
FROM base AS build

RUN --mount=type=bind,source=package.json,target=package.json \
	--mount=type=bind,source=package-lock.json,target=package-lock.json \
	--mount=type=cache,target=/root/.npm \
	npm ci

COPY . .


# * Running the final application
FROM base AS final
ARG app_dir

ENV NODE_ENV=production
USER node

COPY package.json .

COPY --from=build ${app_dir} ${app_dir}
COPY --from=dependencies ${app_dir}/node_modules ${app_dir}/node_modules

VOLUME ["./config.json", "./database.db"]

CMD ["node", "./src/bot"]
