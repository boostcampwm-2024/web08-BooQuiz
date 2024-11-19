import { useState } from 'react';
import { useTimer } from './useTimer';

// 스테이지 타입
export type QuizZone = 'LOBBY' | 'QUIZ_PROGRESS' | 'RESULT';
// export type QuizZone = 'LOBBY' | 'IN_PROGRESS' | 'RESULT'

export type SolveStage = 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
// export type SolveStage = 'WAIT' | 'PLAY' | SUBMIT'

// 퀴즈 타입
export type QuizType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER';

// 퀴즈 진행 상태
export interface QuizProgress {
    currentQuizIndex: number; // 현재 퀴즈 인덱스
    totalQuizzes: number; // 전체 퀴즈 개수
    timeLimit: number; // 제한 시간
}

// 기본 퀴즈 구조
export interface Quiz {
    question: string; // 문제
    type: QuizType; // 퀴즈 유형 (객관식/주관식)
    options?: string[]; // 객관식 보기 (객관식일 때만 사용)
    timeLimit: number; // 문제 제한 시간
}

// 답안 제출 결과
export interface SubmissionResult {
    submitted: boolean; // 제출 여부
    answer?: string; // 제출한 답안
    timeExpired?: boolean; // 시간 초과 여부
}

// 대기실 데이터
export interface LobbyData {
    participants: number; // 참가자 수
    totalQuizCount: number; // 전체 퀴즈 수
    isHost: boolean; // 방장 여부
    quizTitle: string; // 퀴즈 제목
    description?: string; // 퀴즈 설명
}

// 현재 진행중인 퀴즈 데이터
export interface CurrentQuizData extends Quiz {
    submissionResult?: SubmissionResult; // 제출 결과
    deadlineTime?: number; // 마감 시간
    startTime?: number; // 시작 시간
    stage: string; // 현재 단계
    currentIndex: number; // 현재 인덱스
}

// 퀴즈 진행 데이터
export interface QuizProgressData {
    currentQuiz: CurrentQuizData; // 현재 퀴즈 정보
    progress: QuizProgress; // 진행 상황
}

// 결과 데이터
export interface ResultData {
    score: number; // 점수
    quizzes: Quiz[]; // 전체 퀴즈 목록
    submits: SubmissionResult[]; // 제출 결과 목록
}

// 전체 퀴즈존 데이터
export interface QuizZoneData {
    Lobby: LobbyData;
    quizProgress: QuizProgressData;
    result: ResultData;
}

// 설정 타입
export interface QuizStageConfig {
    totalQuizzes: number; // 전체 퀴즈 수
    onMainStageChange?: (stage: QuizZone) => void; // 메인 스테이지 변경 콜백
    onSubStageChange?: (stage: SolveStage) => void; // 서브 스테이지 변경 콜백
    onQuizComplete?: () => void; // 퀴즈 완료 콜백
    onError?: (error: Error) => void; // 에러 처리 콜백
}

// 타이머 설정
export interface TimerConfig {
    prepareTime: number; // 준비 시간
    solutionTime: number; // 풀이 시간
}

const useQuizZone = (config: QuizStageConfig, timerConfig: TimerConfig) => {};
