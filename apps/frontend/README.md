# BooQuiz Frontend

실시간 대규모 참여형 퀴즈 플랫폼 BooQuiz의 프론트엔드 레포지토리입니다.

## 🎯 프로젝트 개요

BooQuiz는 300명 이상의 사용자가 실시간으로 참여할 수 있는 퀴즈 플랫폼입니다. 도전 골든벨 형식의 퀴즈를 웹 기반으로 즐길 수 있습니다.

### 주요 기능

-   실시간 대규모 참여형 퀴즈 진행
-   QR코드/PIN 번호를 통한 간편 입장
-   실시간 답안 제출 및 채점
-   실시간 순위 산정 및 표시
-   다양한 문제 유형 지원 (객관식, 단답형)

## 🛠 기술 스택

### 핵심 기술

-   **Framework:** React 18.3.1
-   **Language:** TypeScript 5.6.2
-   **Build Tool:** Vite 5.4.10
-   **Routing:** React Router DOM 6.27.0
-   **상태 관리:** React Hooks + Context API
-   **WebSocket:** ws 8.18.0

### UI 컴포넌트

-   **CSS Framework:** Tailwind CSS 3.4.14
-   **UI Components:**
    -   Radix UI (Alert Dialog, Avatar, Progress, Tooltip)
    -   shadcn/ui
-   **Icons:** Lucide React 0.454.0
-   **Utility Libraries:**
    -   class-variance-authority
    -   clsx
    -   tailwind-merge
    -   tailwindcss-animate

### 개발 도구

-   **테스트:**
    -   Vitest
    -   Testing Library (React, Jest DOM, Hooks)
    -   JSDOM
-   **문서화:** Storybook 8.4.2
-   **코드 품질:**
    -   ESLint with TypeScript support
    -   TypeScript ESLint
    -   React Hooks/Refresh plugins
-   **타입 지원:** TypeScript ~5.6.2

## 🏗 프로젝트 구조

```
src/
├── assets/                # 정적 리소스
│   └── images/           # 이미지 파일
├── blocks/               # 페이지별 주요 컴포넌트 블록
│   ├── CreateQuizZone/   # 퀴즈존 생성 관련 컴포넌트
│   ├── QuizZone/         # 퀴즈존 진행 관련 컴포넌트
│   └── Skeleton/         # 로딩 스켈레톤 컴포넌트
├── components/           # 재사용 가능한 컴포넌트
│   ├── boundary/         # 에러 바운더리 컴포넌트
│   ├── common/           # 공통 UI 컴포넌트
│   └── ui/              # shadcn/ui 기반 컴포넌트
├── constants/           # 상수 정의
├── hook/               # 커스텀 훅
│   ├── quizZone/       # 퀴즈존 관련 훅
│   └── common/         # 공통 훅
├── lib/                # 유틸리티 라이브러리
├── pages/              # 페이지 컴포넌트
├── router/             # 라우팅 설정
├── test/               # 테스트 설정
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수
```

### 주요 디렉토리 설명

#### 📂 blocks

페이지별 주요 기능 블록을 구성하는 컴포넌트들이 위치합니다. 재사용성보다는 특정 페이지나 기능에 종속적인 컴포넌트들이 포함됩니다.

-   `CreateQuizZone/`: 퀴즈존 생성 관련 컴포넌트
-   `QuizZone/`: 실제 퀴즈 진행 관련 컴포넌트

#### 📂 components

재사용 가능한 UI 컴포넌트들이 위치합니다.

-   `boundary/`: 에러 처리를 위한 바운더리 컴포넌트
-   `common/`: 버튼, 입력창 등 공통 UI 컴포넌트
-   `ui/`: shadcn/ui 기반으로 커스터마이징된 컴포넌트

#### 📂 hook

애플리케이션에서 사용되는 커스텀 훅들이 위치합니다.

-   `useQuizZone`: 퀴즈존 상태 관리
-   `useTimer`: 타이머 기능
-   `useWebSocket`: WebSocket 연결 관리
-   `useValidInput`: 입력값 유효성 검사

#### 📂 pages

애플리케이션의 각 페이지를 구성하는 컴포넌트들이 위치합니다.

-   `MainPage`: 메인 페이지
-   `QuizZonePage`: 퀴즈존 페이지
-   `CreateQuizZonePage`: 퀴즈존 생성 페이지

#### 📂 utils

공통적으로 사용되는 유틸리티 함수들이 위치합니다.

-   `atob`: base64 디코딩
-   `requests`: API 요청 관련 유틸리티
-   `validators`: 유효성 검사 유틸리티

## ⚡️ 주요 커스텀 훅

### useQuizZone

퀴즈존의 전체 상태와 생명주기를 관리하는 핵심 훅입니다.

```typescript
const {
    quizZoneState, // 퀴즈존 현재 상태
    initQuizZoneData, // 초기 데이터 설정
    submitQuiz, // 답안 제출
    startQuiz, // 퀴즈 시작
    playQuiz, // 플레이 모드 전환
    exitQuiz, // 퀴즈존 나가기
} = useQuizZone();
```

### useTimer

실시간 타이머 기능을 제공하는 훅입니다.

```typescript
const { time, start } = useTimer({
    initialTime: 60,
    onComplete: () => console.log('타이머 완료!'),
});
```

### useWebSocket

WebSocket 연결 및 메시지 처리를 관리하는 훅입니다.

```typescript
const { sendMessage, closeConnection } = useWebSocket(wsUrl, messageHandler);
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

필요한 환경 변수:

-   `VITE_WS_URL`: WebSocket 서버 URL

5. 개발 서버 실행

```bash
pnpm dev
```

## 📦 스크립트

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 미리보기
pnpm preview

# 테스트 실행
pnpm test        # 감시 모드
pnpm test:run    # 단일 실행

# Storybook 실행
pnpm storybook

# Storybook 빌드
pnpm build-storybook

# 린트 검사
pnpm lint
```

## 🔍 주요 페이지 흐름

1. **메인 페이지**

    - PIN 번호 입력
    - QR 코드 스캔
    - 퀴즈존 생성

2. **퀴즈존 대기실**

    - 참가자 목록 확인
    - 퀴즈 정보 확인
    - 시작 대기

3. **퀴즈 진행**

    - 문제 출제
    - 답안 제출
    - 실시간 피드백

4. **결과 확인**
    - 최종 점수
    - 순위 확인
    - 문제별 결과

## 🧪 테스트

프로젝트는 Vitest와 Testing Library를 사용하여 테스트를 작성합니다.

```bash
# 테스트 감시 모드 실행
pnpm test

# 전체 테스트 단일 실행
pnpm test:run

# 특정 파일 테스트
pnpm test src/components/MyComponent.test.tsx
```

## 📚 Storybook

컴포넌트 문서화와 개발을 위해 Storybook을 사용합니다.

```bash
# Storybook 개발 서버 실행 (기본 포트: 6006)
pnpm storybook

# Storybook 정적 빌드
pnpm build-storybook
```

## 📝 패키지 관리

이 프로젝트는 패키지 관리자로 pnpm을 사용합니다. pnpm은 디스크 공간을 효율적으로 사용하고, 설치 속도가 빠르며, 패키지 버전을 더 엄격하게 관리합니다.

### pnpm 주요 명령어

```bash
# 의존성 설치
pnpm install

# 개발 의존성 추가
pnpm add -D [package-name]

# 일반 의존성 추가
pnpm add [package-name]

# 의존성 제거
pnpm remove [package-name]

# 의존성 업데이트
pnpm update

# 캐시 정리
pnpm store prune
```

## 📝 개발 가이드라인

### 컴포넌트 작성

-   Presentational/Container 패턴 준수
-   Props에 대한 명확한 타입 정의
-   재사용 가능한 컴포넌트는 components 디렉토리에 배치
-   페이지별 컴포넌트는 blocks 디렉토리에 배치

### 상태 관리

-   지역 상태는 useState 활용
-   복잡한 상태 로직은 useReducer 사용

### 실시간 통신

-   WebSocket 연결은 useWebSocket 훅 사용
-   연결 끊김에 대한 자동 재연결 처리
-   메시지 큐를 통한 순차적 처리

## 🔐 보안 고려사항

-   WebSocket 메시지 검증
-   사용자 입력 데이터 검증
-   API 요청 시 인증 토큰 관리
-   환경 변수를 통한 설정 관리

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. feature/[기능명] 브랜치 생성
3. 개발 및 테스트 완료
4. PR 생성 및 리뷰 요청

## ⚖️ 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
