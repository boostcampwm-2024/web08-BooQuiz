import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Typography.stories';
import Typography from './Typogrpahy';

const { Default, ExtraSmall, Small, Large, GrayText, RedText, AllSizes, AllColors } =
    composeStories(stories);

describe('Typography 컴포넌트', () => {
    // 기본 렌더링 테스트
    it('기본 스토리가 올바르게 렌더링됩니다', () => {
        render(<Default />);
        const element = screen.getByText('Hello World');
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass('text-base', 'text-black');
    });

    // 크기 테스트
    it('xs 크기가 올바르게 적용됩니다', () => {
        render(<ExtraSmall />);
        const element = screen.getByText('Extra Small Text');
        expect(element).toHaveClass('text-xs');
    });

    it('sm 크기가 올바르게 적용됩니다', () => {
        render(<Small />);
        const element = screen.getByText('Small Text');
        expect(element).toHaveClass('text-sm');
    });

    it('lg 크기가 올바르게 적용됩니다', () => {
        render(<Large />);
        const element = screen.getByText('Large Text');
        expect(element).toHaveClass('text-lg');
    });

    // 색상 테스트
    it('회색 텍스트가 올바르게 적용됩니다', () => {
        render(<GrayText />);
        const element = screen.getByText('Gray Colored Text');
        expect(element).toHaveClass('text-gray-400');
    });

    it('빨간색 텍스트가 올바르게 적용됩니다', () => {
        render(<RedText />);
        const element = screen.getByText('Red Colored Text');
        expect(element).toHaveClass('text-red-600');
    });

    // 직접 컴포넌트 렌더링 테스트
    describe('직접 컴포넌트 props 테스트', () => {
        it('bold 속성이 올바르게 적용됩니다', () => {
            render(<Typography text="Bold Text" size="base" color="black" bold={true} />);
            const element = screen.getByText('Bold Text');
            expect(element).toHaveClass('font-bold');
        });

        it('파란색 텍스트가 올바르게 적용됩니다', () => {
            render(<Typography text="Blue Text" size="base" color="blue" />);
            const element = screen.getByText('Blue Text');
            expect(element).toHaveClass('text-blue-600');
        });

        it('모든 크기 옵션이 올바른 클래스를 가집니다', () => {
            const sizes = [
                'xs',
                'sm',
                'base',
                'lg',
                'xl',
                '2xl',
                '3xl',
                '4xl',
                '5xl',
                '6xl',
            ] as const;
            sizes.forEach((size) => {
                render(<Typography text={`${size} text`} size={size} color="black" />);
                const element = screen.getByText(`${size} text`);
                expect(element).toHaveClass(`text-${size}`);
            });
        });
    });

    // 복합 컴포넌트 렌더링 테스트
    describe('복합 컴포넌트 스토리 테스트', () => {
        it('AllSizes 스토리가 모든 크기를 렌더링합니다', () => {
            render(<AllSizes />);
            const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
            sizes.forEach((size) => {
                const element = screen.getByText(`${size} size text`);
                expect(element).toBeInTheDocument();
                expect(element).toHaveClass(`text-${size}`);
            });
        });

        it('AllColors 스토리가 모든 색상을 렌더링합니다', () => {
            render(<AllColors />);
            const colorClassMap = {
                black: 'text-black',
                gray: 'text-gray-400',
                red: 'text-red-600',
            };

            Object.entries(colorClassMap).forEach(([color, className]) => {
                const element = screen.getByText(`${color} colored text`);
                expect(element).toBeInTheDocument();
                expect(element).toHaveClass(className);
            });
        });
    });

    // 에러 케이스 테스트
    describe('에러 케이스 테스트', () => {
        it('지원하지 않는 크기를 전달하면 기본 크기가 적용됩니다', () => {
            // @ts-expect-error: 잘못된 크기를 전달하여 테스트
            render(<Typography text="Invalid Size" size="invalid" color="black" />);
            const element = screen.getByText('Invalid Size');
            expect(element).toHaveClass('text-base');
        });

        it('지원하지 않는 색상을 전달하면 기본 색상이 적용됩니다', () => {
            // @ts-expect-error: 잘못된 색상을 전달하여 테스트
            render(<Typography text="Invalid Color" size="base" color="invalid" />);
            const element = screen.getByText('Invalid Color');
            expect(element).toHaveClass('text-black');
        });
    });
});
