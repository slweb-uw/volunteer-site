FROM node:22-trixie-slim

RUN apt-get update \
   && apt-get install -y --no-install-recommends openjdk-21-jre-headless \
   && rm -rf /var/lib/apt/lists/*

RUN npm install -g firebase-tools@15.27.0

RUN firebase setup:emulators:firestore

WORKDIR /app
EXPOSE 8080
CMD ["firebase", "emulators:start", "--only", "firestore", "--project", "demo-test"]