import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTimer } from './useTimer';

describe('useTimer', () => {
    // 각 테스트 케이스 실행 전에 실행되는 설정
    beforeEach(() => {
        // 가짜 타이머를 설정하여 시간 관련 테스트를 제어 가능하게 함
        vi.useFakeTimers();
    });

    // 각 테스트 케이스 실행 후에 실행되는 정리
    afterEach(() => {
        // 모든 모의 객체(mocks)를 초기화
        vi.restoreAllMocks();
    });

    it('기본값이 올바르게 초기화되어야 한다', () => {
        // useTimer 훅을 렌더링하고 결과를 받아옴
        const { result } = renderHook(() => useTimer({ initialTime: 60 }));

        // 초기 시간값이 null인지 확인
        expect(result.current.time).toBe(null);
        // 초기 실행 상태가 false인지 확인
        expect(result.current.isRunning).toBe(false);
    });

    it('autoStart가 true일 때 자동으로 시작되어야 한다', () => {
        // autoStart를 true로 설정하여 훅을 렌더링
        const { result } = renderHook(() => useTimer({ initialTime: 60, autoStart: true }));

        // 시작 시간이 60으로 설정되었는지 확인
        expect(result.current.time).toBe(60);
        // 타이머가 실행 중인지 확인
        expect(result.current.isRunning).toBe(true);
    });

    it('시간이 정확하게 카운트다운 되어야 한다', () => {
        // 1초로 초기화된 타이머 훅을 렌더링
        const { result } = renderHook(() => useTimer({ initialTime: 1 }));

        // 타이머 시작
        act(() => {
            result.current.start();
        });

        // 초기값이 1초로 설정되었는지 확인
        expect(result.current.time).toBe(1);
        // 타이머가 실행 중인지 확인
        expect(result.current.isRunning).toBe(true);

        // 0.5초 시간 진행
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // 0.5초가 남았는지 확인 (부동 소수점 오차를 고려하여 toBeCloseTo 사용)
        expect(result.current.time).toBeCloseTo(0.5, 5);
    });

    it('타이머가 0에 도달하면 onComplete 콜백이 호출되어야 한다', () => {
        // 콜백 함수를 모의(mock) 함수로 생성
        const onComplete = vi.fn();
        // 0.2초로 설정된 타이머 훅을 렌더링
        const { result } = renderHook(() => useTimer({ initialTime: 0.2, onComplete }));

        // 타이머 시작
        act(() => {
            result.current.start();
        });

        // 0.3초 시간 진행 (타이머가 완료되도록)
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // onComplete 콜백이 한 번 호출되었는지 확인
        expect(onComplete).toHaveBeenCalledTimes(1);
        // 타이머가 완료되어 시간이 null이 되었는지 확인
        expect(result.current.time).toBe(null);
        // 타이머가 중지되었는지 확인
        expect(result.current.isRunning).toBe(false);
    });

    it('타이머가 올바르게 정지되어야 한다', () => {
        // 60초로 설정된 타이머 훅을 렌더링
        const { result } = renderHook(() => useTimer({ initialTime: 60 }));

        // 타이머 시작
        act(() => {
            result.current.start();
        });

        // 타이머가 실행 중인지 확인
        expect(result.current.isRunning).toBe(true);

        // 타이머 정지
        act(() => {
            result.current.stop();
        });

        // 타이머가 중지되었는지 확인
        expect(result.current.isRunning).toBe(false);
        // 시간이 null로 초기화되었는지 확인
        expect(result.current.time).toBe(null);
    });

    it('타이머가 올바르게 리셋되어야 한다', () => {
        // 60초로 설정된 타이머 훅을 렌더링
        const { result } = renderHook(() => useTimer({ initialTime: 60 }));

        act(() => {
            // 타이머 시작
            result.current.start();
            // 1초 진행
            vi.advanceTimersByTime(1000);
            // 타이머 리셋
            result.current.reset();
        });

        // 시간이 초기값으로 돌아갔는지 확인
        expect(result.current.time).toBe(60);
        // 타이머가 중지되었는지 확인
        expect(result.current.isRunning).toBe(false);
    });

    it('새로운 시간이 올바르게 설정되어야 한다', () => {
        // 60초로 설정된 타이머 훅을 렌더링
        const { result } = renderHook(() => useTimer({ initialTime: 60 }));

        // 새로운 시간(30초)으로 설정
        act(() => {
            result.current.setTime(30);
        });

        // 시간이 30초로 변경되었는지 확인
        expect(result.current.time).toBe(30);
    });

    it('음수 시간값이 설정되는 것을 방지해야 한다', () => {
        // 60초로 설정된 타이머 훅을 렌더링
        const { result } = renderHook(() => useTimer({ initialTime: 60 }));

        // 음수 시간(-10초) 설정 시도
        act(() => {
            result.current.setTime(-10);
        });

        // 시간이 0으로 설정되었는지 확인
        expect(result.current.time).toBe(0);
    });

    it('컴포넌트 언마운트 시 인터벌이 정리되어야 한다', () => {
        // clearInterval 함수에 대한 스파이 설정
        const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
        // 자동 시작되는 타이머 훅을 렌더링
        const { unmount } = renderHook(() => useTimer({ initialTime: 60, autoStart: true }));

        // 컴포넌트 언마운트
        unmount();

        // clearInterval이 호출되었는지 확인
        expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('시작 시 새로운 시간이 제공되면 해당 시간으로 시작되어야 한다', () => {
        // 60초로 설정된 타이머 훅을 렌더링
        const { result } = renderHook(() => useTimer({ initialTime: 60 }));

        // 30초로 설정하여 타이머 시작
        act(() => {
            result.current.start(30);
        });

        // 시간이 30초로 설정되었는지 확인
        expect(result.current.time).toBe(30);
        // 타이머가 실행 중인지 확인
        expect(result.current.isRunning).toBe(true);
    });
});
