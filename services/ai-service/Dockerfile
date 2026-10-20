ARG NODE_VERSION=22
ARG WORKSPACE=services/ai-service
ARG PORT=4005

FROM node:${NODE_VERSION}-slim AS deps
ARG WORKSPACE
WORKDIR /app

COPY package.json package-lock.json ./
COPY gateway/package.json ./gateway/package.json
COPY services/auth-service/package.json ./services/auth-service/package.json
COPY services/employee-service/package.json ./services/employee-service/package.json
COPY services/patient-service/package.json ./services/patient-service/package.json
COPY services/medicalrecord-service/package.json ./services/medicalrecord-service/package.json
COPY services/ai-service/package.json ./services/ai-service/package.json

RUN mkdir -p /app/${WORKSPACE}/node_modules

RUN npm ci --omit=dev --workspace=${WORKSPACE}

FROM node:${NODE_VERSION}-slim AS runtime
ARG WORKSPACE
ARG PORT
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY ${WORKSPACE} ./${WORKSPACE}
COPY --from=deps /app/${WORKSPACE}/node_modules ./${WORKSPACE}/node_modules

USER node
WORKDIR /app/${WORKSPACE}
EXPOSE ${PORT}

# auth-service: siembra el admin inicial (idempotente) y luego arranca.
# `exec` hace que Node reciba las señales de parada (docker stop).
CMD ["node", "src/server.js"]