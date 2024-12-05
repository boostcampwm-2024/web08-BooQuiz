import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import useValidState from './useValidInput';

describe('useValidState', () => {
    test('초기값이 유효한 경우', () => {
        const validator = (value: number) => {
            if (value < 0) return '음수는 입력할 수 없습니다.';
        };

        const { result } = renderHook(() => useValidState<number>(10, validator));
        const [state, errorMessage, _, isInvalid] = result.current;

        expect(state).toBe(10);
        expect(errorMessage).toBe('');
        expect(isInvalid).toBe(false);
    });

    test('초기값이 유효하지 않은 경우', () => {
        const validator = (value: number) => {
            if (value < 0) return '음수는 입력할 수 없습니다.';
        };

        const { result } = renderHook(() => useValidState<number>(-5, validator));
        const [state, errorMessage, _, isInvalid] = result.current;

        expect(state).toBe(-5);
        expect(errorMessage).toBe('음수는 입력할 수 없습니다.');
        expect(isInvalid).toBe(true);
    });

    test('유효한 값으로 상태 업데이트', () => {
        const validator = (value: number) => {
            if (value < 0) return '음수는 입력할 수 없습니다.';
        };

        const { result } = renderHook(() => useValidState<number>(0, validator));

        act(() => {
            const [, , setValue] = result.current;
            setValue(5);
        });

        const [state, errorMessage, _, isInvalid] = result.current;
        expect(state).toBe(5);
        expect(errorMessage).toBe('');
        expect(isInvalid).toBe(false);
    });

    test('유효하지 않은 값으로 상태 업데이트', () => {
        const validator = (value: number) => {
            if (value < 0) return '음수는 입력할 수 없습니다.';
        };

        const { result } = renderHook(() => useValidState<number>(0, validator));

        act(() => {
            const [, , setValue] = result.current;
            setValue(-10);
        });

        const [state, errorMessage, _, isInvalid] = result.current;
        expect(state).toBe(-10);
        expect(errorMessage).toBe('음수는 입력할 수 없습니다.');
        expect(isInvalid).toBe(true);
    });

    test('다중 조건 검증', () => {
        const validator = (value: number) => {
            if (value < 0) return '음수는 입력할 수 없습니다.';
            if (value > 100) return '100보다 큰 숫자는 입력할 수 없습니다.';
        };

        const { result } = renderHook(() => useValidState<number>(0, validator));

        // 유효한 값 테스트
        act(() => {
            const [, , setValue] = result.current;
            setValue(50);
        });

        expect(result.current[0]).toBe(50);
        expect(result.current[1]).toBe('');
        expect(result.current[3]).toBe(false);

        // 범위를 초과하는 값 테스트
        act(() => {
            const [, , setValue] = result.current;
            setValue(150);
        });

        expect(result.current[0]).toBe(150);
        expect(result.current[1]).toBe('100보다 큰 숫자는 입력할 수 없습니다.');
        expect(result.current[3]).toBe(true);
    });

    test('문자열 유효성 검사', () => {
        const validator = (value: string) => {
            if (value.length < 3) return '최소 3글자 이상이어야 합니다.';
        };

        const { result } = renderHook(() => useValidState<string>('', validator));

        // 유효하지 않은 값 테스트
        act(() => {
            const [, , setValue] = result.current;
            setValue('ab');
        });

        expect(result.current[0]).toBe('ab');
        expect(result.current[1]).toBe('최소 3글자 이상이어야 합니다.');
        expect(result.current[3]).toBe(true);

        // 유효한 값 테스트
        act(() => {
            const [, , setValue] = result.current;
            setValue('abc');
        });

        expect(result.current[0]).toBe('abc');
        expect(result.current[1]).toBe('');
        expect(result.current[3]).toBe(false);
    });
});
