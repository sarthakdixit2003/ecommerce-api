# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.12.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV dev
ENV PORT 5000
ENV JWT_SECRET_KEY deb4fbb4f3bfcbbf602e72ed176f89c32c21e7801287e8543c1bda89ab86b37c53543d30ed3a2e918b7b58ed88719ae9702a2aaf3835de735490e22de935b5a5
ENV JWT_REFRESH_SECRET_KEY ae896022398effbb041564fa9fac7445b4050910cc380236d2c342870efdc1a80f9d984ee38b13e6d284bdfd994a0dca509e5e7c7971e73434841b672bb56f78
ENV JWT_EXPIRY_TIME 1h
ENV JWT_REFRESH_EXPIRE_TIME 7d


WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 5000

# Run the application.
CMD ["npm", "run", "start:dev"]
