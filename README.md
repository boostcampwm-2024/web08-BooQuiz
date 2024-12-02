# BooQuiz - 실시간 대규모 퀴즈 플랫폼

[팀 노션](https://www.notion.so/BooQuiz-127f1897cdf5809c8a44d54384683bc6?pvs=21) | [백로그](https://github.com/orgs/boostcampwm-2024/projects/11) | [그라운드 룰](https://github.com/boostcampwm-2024/web08-BooQuiz/wiki/%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C-%EB%A3%B0) | [기획서](https://www.notion.so/12cf1897cdf5801487a3dc1438627a99?pvs=21) | [figma](https://www.figma.com/design/1CdBFnF3oWXgAzRdgEhRNU/Web08?node-id=0-1&t=bfZtQb8UJrKIcfTK-1) | [개발위키](https://www.notion.so/12cf1897cdf58093bf0afe75f24401d7?pvs=21)

## 📝 프로젝트 소개

BooQuiz는 300명 이상의 사용자가 로그인 없이 동시에 참여할 수 있는 실시간 퀴즈 플랫폼입니다.

약 6주간 1주일 단위의 점진적인 릴리즈를 통해 서비스를 지속적으로 개선하였습니다.

이를 통해 최초 1인 플레이 부터 시작하여 300명 이상의 사용자가 동시 접속 플레이 할 수 있도록 확장하였습니다.

## 핵심 기능

### 🎯 입장 코드를 통한 간편한 퀴즈 참여

![](https://github.com/user-attachments/assets/a1fa1ac7-f521-41a1-b9a8-446271286662)

### ⚡ 300명 이상 동시 접속 지원

[테스트 한 결과로]

-   테스트 도구를 통해 만들어놓은 퀴즈존에 300명을 접속시키고 로비에 300명의 사용자가 있는 사진 추가

### 📊 실시간 답안 제출 현황 표시

[실시간 답안 제출 → 포디움 되는 거 gif로 올리기]

### 📈 퀴즈존 별 최종 결과 확인

### 🎮 원하는 퀴즈를 직접 만들기

![이미지1](https://github.com/user-attachments/assets/222e5642-314e-4d3b-ad66-5d9c99b7d2fa)

![이미지2](https://github.com/user-attachments/assets/bc386bbf-da42-42bd-8591-5839a313d7cc)

![이미지3](https://github.com/user-attachments/assets/9c5d5821-28b0-47a6-9332-af3db645cd14)

## 🛠 기술 스택

### Frontend

| 분류       | 기술                                                                                                                                                                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 프레임워크 | ![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)                                                                                                                                            |
| 언어       | ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=flat-square&logo=typescript&logoColor=white)                                                                                                                              |
| 빌드 도구  | ![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=flat-square&logo=vite&logoColor=white)                                                                                                                                               |
| 스타일링   | ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000?style=flat-square)                                 |
| 통신       | ![WebSocket](https://img.shields.io/badge/WebSocket-8.18.0-010101?style=flat-square&logo=socket.io&logoColor=white)                                                                                                                                |
| 테스트     | ![Vitest](https://img.shields.io/badge/Vitest-latest-6E9F18?style=flat-square&logo=vitest&logoColor=white) ![Testing Library](https://img.shields.io/badge/Testing%20Library-latest-E33332?style=flat-square&logo=testing-library&logoColor=white) |
| 문서화     | ![Storybook](https://img.shields.io/badge/Storybook-8.4.2-FF4785?style=flat-square&logo=storybook&logoColor=white) ![TSDoc](https://img.shields.io/badge/TSDoc-0.26.11-3178C6?style=flat-square&logo=typescript&logoColor=white)                   |

### Backend

| 분류         | 기술                                                                                                                                                                                                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 프레임워크   | ![NestJS](https://img.shields.io/badge/NestJS-10.4.7-E0234E?style=flat-square&logo=nestjs&logoColor=white)                                                                                                                                                                                                             |
| 언어         | ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=flat-square&logo=typescript&logoColor=white)                                                                                                                                                                                                  |
| 데이터베이스 | ![MySQL](https://img.shields.io/badge/MySQL-2-4479A1?style=flat-square&logo=mysql&logoColor=white) ![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-0.3.20-E93524?style=flat-square&logo=typeorm&logoColor=white) |
| 통신         | ![WebSocket](https://img.shields.io/badge/WebSocket-@nestjs/websockets-010101?style=flat-square&logo=socket.io&logoColor=white)                                                                                                                                                                                        |
| API 문서     | ![Swagger](https://img.shields.io/badge/Swagger-8.0.5-85EA2D?style=flat-square&logo=swagger&logoColor=black) ![TSDoc](https://img.shields.io/badge/TSDoc-0.26.11-3178C6?style=flat-square&logo=typescript&logoColor=white)                                                                                             |
| 테스트       | ![Jest](https://img.shields.io/badge/Jest-Testing-C21325?style=flat-square&logo=jest&logoColor=white) ![SuperTest](https://img.shields.io/badge/SuperTest-Testing-009688?style=flat-square&logo=testing-library&logoColor=white)                                                                                       |
| 부하 테스트  | ![Artillery](https://img.shields.io/badge/Artillery-2.0.21-CA2B2B?style=flat-square&logoColor=white)                                                                                                                                                                                                                   |

### 인프라

| 분류     | 기술                                                                                                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 클라우드 | ![NCP](https://img.shields.io/badge/Naver%20Cloud%20Platform-latest-03C75A?style=flat-square&logo=naver&logoColor=white)                                                                                                                     |
| 서버     | ![Nginx](https://img.shields.io/badge/Nginx-1.24.0-009639?style=flat-square&logo=nginx&logoColor=white)                                                                                                                                      |
| 배포     | ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-3.0-2088FF?style=flat-square&logo=github-actions&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-24.0.7-2496ED?style=flat-square&logo=docker&logoColor=white) |
| 운영체제 | ![Linux](https://img.shields.io/badge/Linux-Ubuntu%2022.04-FCC624?style=flat-square&logo=linux&logoColor=black)                                                                                                                              |

### 협업 도구

| 분류          | 기술                                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 문서화        | ![Notion](https://img.shields.io/badge/Notion-2.0.41-000000?style=flat-square&logo=notion&logoColor=white)                                                                                                                     |
| 디자인        | ![Figma](https://img.shields.io/badge/Figma-latest-F24E1E?style=flat-square&logo=figma&logoColor=white) ![Excalidraw](https://img.shields.io/badge/Excalidraw-latest-6965DB?style=flat-square&logo=excalidraw&logoColor=white) |
| 화상회의      | ![Zoom](https://img.shields.io/badge/Zoom-5.17.0-2D8CFF?style=flat-square&logo=zoom&logoColor=white)                                                                                                                           |
| 형상관리      | ![Git](https://img.shields.io/badge/Git-2.42.0-F05032?style=flat-square&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-latest-181717?style=flat-square&logo=github&logoColor=white)                   |
| 프로젝트 관리 | ![GitHub Projects](https://img.shields.io/badge/GitHub%20Projects-latest-181717?style=flat-square&logo=github&logoColor=white)                                                                                                 |

## 🏗 시스템 아키텍처

![system-architecture](https://github.com/user-attachments/assets/ba41c87f-fb55-438f-a122-296abf58e355)

## 🚀 시작하기

1. 레포지토리 클론

```bash
git clone https://github.com/boostcampwm-2024/web08-BooQuiz.git
```

1. 패키지 매니저 설치 (pnpm 사용)

```bash
npm install -g pnpm
```

1. Frontend 설정

```bash
cd frontend
pnpm install
cp .env.example .env
pnpm dev
```

1. Backend 설정

```bash
cd backend
pnpm install
cp .env.example .env
pnpm start:dev
```

## 📚 프로젝트 구조

```
/
├── frontend/                # 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── blocks/         # 페이지별 주요 컴포넌트
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── hook/          # 커스텀 훅
│   │   └── pages/         # 페이지 컴포넌트
│   └── ...
│
├── backend/                 # 백엔드 애플리케이션
│   ├── src/
│   │   ├── common/        # 공통 유틸리티
│   │   ├── core/         # 핵심 기능
│   │   ├── quiz-zone/    # 퀴즈존 상태 정보 관리
│   │   ├── quiz/         # 퀴즈 CRUD
│   │   └── play/         # 실시간 퀴즈 관리
│   └── ...
└── ...
```

## 팀 소개(표인데 얘는 수정하지 말아주세요)

| [J004 강준현](https://github.com/JunhyunKang)             | [J074 김현우](https://github.com/krokerdile)              | [J086 도선빈](https://github.com/typingmistake)            | [J175 이동현](https://github.com/codemario318)             | [J217 전현민](https://github.com/joyjhm)                  |
| --------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| ![](https://avatars.githubusercontent.com/u/72436328?v=4) | ![](https://avatars.githubusercontent.com/u/39644976?v=4) | ![](https://avatars.githubusercontent.com/u/102957984?v=4) | ![](https://avatars.githubusercontent.com/u/130330767?v=4) | ![](https://avatars.githubusercontent.com/u/77275989?v=4) |

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. feature/[기능명] 브랜치 생성
3. 개발 및 테스트 완료
4. PR 생성 및 리뷰 요청
