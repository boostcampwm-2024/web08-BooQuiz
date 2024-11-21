// useTimer.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTimer } from './useTimer';

describe('useTimer', () => {
    beforeEach(() => {
        // 가짜 타이머 설정
        vi.useFakeTimers();
    });

    afterEach(() => {
        // 테스트 간 타이머 정리
        vi.clearAllTimers();
        vi.restoreAllMocks();
    });

    it('초기 시간이 올바르게 설정되어야 한다', () => {
        const { result } = renderHook(() =>
            useTimer({
                initialTime: 10,
                onComplete: () => {},
            }),
        );

        expect(result.current.time).toBe(10);
    });

    it('start 호출 시 카운트다운이 시작되어야 한다', () => {
        const { result } = renderHook(() =>
            useTimer({
                initialTime: 10,
                onComplete: () => {},
            }),
        );

        act(() => {
            result.current.start();
        });

        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(result.current.time).toBe(9.9);
    });

    it('타이머가 0에 도달하면 onComplete가 한 번만 호출되어야 한다', () => {
        const onComplete = vi.fn();
        const { result } = renderHook(() =>
            useTimer({
                initialTime: 0.2,
                onComplete,
            }),
        );

        act(() => {
            result.current.start();
        });

        // 타이머가 0에 도달할 때까지 시간 진행
        act(() => {
            vi.advanceTimersByTime(200);
        });

        // onComplete가 정확히 한 번만 호출되었는지 확인
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('컴포넌트 언마운트 시 모든 타이머가 정리되어야 한다', () => {
        const { unmount } = renderHook(() =>
            useTimer({
                initialTime: 10,
                onComplete: () => {},
            }),
        );

        unmount();

        expect(vi.getTimerCount()).toBe(0);
    });
});
