# syntax=docker/dockerfile:1

ARG app_dir="/home/node/app"


# * Base Node.js image
FROM node:20-alpine AS base
ARG app_dir
WORKDIR ${app_dir}
RUN apk add --no-cache python3 py3-pip make gcc g++

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

# Since the code references config.json directly via import,
# this hack uses config.example.json temporarily just for the build to complete.
# In runtime, it will still look for the real config.json.
RUN --mount=type=bind,source=config.example.json,target=config.json \
	npm run build

# * Running the final application
FROM base AS final
ARG app_dir

ENV NODE_ENV=production
USER node

COPY package.json .

COPY --from=build ${app_dir}/dist ${app_dir}/dist
COPY --from=dependencies ${app_dir}/node_modules ${app_dir}/node_modules

VOLUME ["./config.json", "./database.db"]

CMD ["node", "./dist/bot"]
