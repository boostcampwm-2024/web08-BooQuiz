# BooQuiz Backend

실시간 대규모 참여형 퀴즈 플랫폼 BooQuiz의 백엔드 레포지토리입니다.

## 🎯 프로젝트 개요

BooQuiz 백엔드는 NestJS 기반의 서버로, 실시간 퀴즈 진행을 위한 WebSocket 통신과 퀴즈 관리를 위한 RESTful API를 제공합니다.

### 주요 기능

-   WebSocket 기반 실시간 퀴즈 진행
-   퀴즈/퀴즈셋 CRUD
-   실시간 답안 제출 및 채점
-   세션 기반 퀴즈존 관리
-   300명 이상 동시 접속 지원

## 🛠 기술 스택

### 핵심 기술

-   **Framework:** NestJS 10.0.0
-   **Language:** TypeScript 5.1.3
-   **Runtime:** Node.js
-   **WebSocket:** ws 8.18.0, @nestjs/websockets
-   **Database:**
    -   MySQL 2 (Production)
    -   SQLite3 (Development)
    -   TypeORM

### 주요 라이브러리

-   **설정 관리:** @nestjs/config
-   **API 문서화:** @nestjs/swagger 8.0.5
-   **ORM:**
    -   TypeORM 0.3.20
    -   typeorm-transactional
-   **Validation:**
    -   class-validator
    -   class-transformer
-   **로깅:**
    -   winston
    -   nest-winston

### 개발 도구

-   **테스트:**
    -   Jest
    -   supertest
    -   superwstest
-   **코드 품질:**
    -   ESLint
    -   Prettier
-   **빌드 도구:** @nestjs/cli

## 🏗 프로젝트 구조

```
src/
├── common/              # 공통 유틸리티 및 상수
├── core/               # 핵심 기능 (WebSocket 어댑터 등)
├── logger/             # 로깅 설정
├── play/               # 실시간 퀴즈 진행 관련
│   ├── dto/           # 데이터 전송 객체
│   ├── entities/      # 엔티티 정의
│   └── gateway/       # WebSocket 게이트웨이
├── quiz/               # 퀴즈 관리
│   ├── dto/           # 데이터 전송 객체
│   ├── entity/        # 엔티티 정의
│   └── repository/    # 리포지토리 계층
└── quiz-zone/          # 퀴즈존 관리
    ├── dto/           # 데이터 전송 객체
    ├── entities/      # 엔티티 정의
    └── repository/    # 리포지토리 계층
```

## 🚀 시작하기

1. 프로젝트 클론

```bash
git clone https://github.com/boostcampwm-2024/web08-BooQuiz.git
```

2. pnpm 설치 (없는 경우)

```bash
npm install -g pnpm
```

3. 의존성 설치

```bash
pnpm install
```

4. 환경 변수 설정

```bash
cp .env.example .env
```

5. 개발 서버 실행

```bash
pnpm start:dev
```

## 📦 스크립트

```bash
# 개발 서버 실행
pnpm start:dev

# 프로덕션 빌드
pnpm build

# 프로덕션 실행
pnpm start:prod

# 테스트 실행
pnpm test           # 단위 테스트
pnpm test:e2e      # E2E 테스트
pnpm test:cov      # 테스트 커버리지

# 린트 및 포맷팅
pnpm lint
pnpm format
```

## 📡 API 문서

### REST API

-   Swagger UI: `http://localhost:3000/api`
-   API 문서: `http://localhost:3000/api-json`

### WebSocket 이벤트

#### 클라이언트 → 서버

-   `join`: 퀴즈존 입장
-   `start`: 퀴즈 시작
-   `submit`: 답안 제출
-   `leave`: 퀴즈존 퇴장

#### 서버 → 클라이언트

-   `nextQuiz`: 다음 문제 정보
-   `result`: 제출 결과
-   `summary`: 최종 결과
-   `finish`: 퀴즈 종료

## 🧪 테스트

프로젝트는 Jest를 사용하여 단위 테스트와 E2E 테스트를 지원합니다.

```bash
# 단위 테스트
pnpm test

# E2E 테스트
pnpm test:e2e

# 특정 파일 테스트
pnpm test src/quiz/quiz.service.spec.ts
```

## 📝 개발 가이드라인

### 아키텍처

-   계층형 아키텍처 (Controller → Service → Repository)
-   도메인 주도 설계 원칙 준수
-   SOLID 원칙 적용

### 코드 스타일

-   ESLint/Prettier 설정 준수
-   NestJS 코딩 컨벤션 따르기
-   명확한 타입 정의

### WebSocket 통신

-   세션 기반 연결 관리
-   실시간 이벤트 처리
-   연결 끊김 대응

## 🔐 보안 고려사항

-   세션 기반 인증
-   WebSocket 연결 검증
-   입력값 검증
-   SQL Injection 방지
-   Rate Limiting

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. feature/[기능명] 브랜치 생성
3. 개발 및 테스트 완료
4. PR 생성 및 리뷰 요청

## ⚖️ 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
