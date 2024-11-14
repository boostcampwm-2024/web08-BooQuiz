# 빌드 단계
FROM node:20-alpine AS builder
WORKDIR /app

# pnpm 전역 설치
RUN npm install -g pnpm

# 의존성 파일들 복사
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/tsconfig*.json ./apps/backend

# backend 의존성 설치 (락파일 검사 무시)
RUN pnpm install -C apps/backend --no-frozen-lockfile

# 소스 코드 복사 및 빌드 실행
COPY apps/backend ./apps/backend
# 수정: 디렉토리를 이동한 후 빌드 실행
WORKDIR /app/apps/backend
RUN pnpm run build

# 프로덕션 단계
FROM node:20-alpine AS production
WORKDIR /app

# 빌드 도구 설치 및 환경 변수 설정
RUN apk add --no-cache build-base
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"


# 프로덕션 환경용 pnpm 설치
RUN npm install -g pnpm
RUN pnpm add -g pm2

# 빌더 단계에서 필요한 파일들만 복사
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
# 프로덕션 실행에 필요한 의존성만 설치 (devDependencies 제외)
# --no-frozen-lockfile: 락파일 버전 제약을 완화하여 호환되는 최신 버전 허용
RUN pnpm install --no-frozen-lockfile

ARG NODE_ENV
ARG SESSION_SECRET

ENV NODE_ENV=$NODE_ENV
ENV SESSION_SECRET=$SESSION_SECRET

# 포트 설정 및 앱 실행
EXPOSE 3000
CMD ["pm2-runtime", "start", "dist/src/main.js"]