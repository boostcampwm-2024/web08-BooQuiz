import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    isFilled?: boolean; // isFulfill -> isFilled로 변경
    clickEvent: () => void;
    width?: string;
    height?: string;
}

const CommonButton = forwardRef<HTMLButtonElement, CommonButtonProps>(
    (
        {
            text,
            isFilled = false, // isFulfill -> isFilled로 변경
            clickEvent,
            disabled = false,
            className = '',
            type = 'button',
            ...props
        },
        ref,
    ) => {
        // 기본 스타일 클래스들
        const baseStyles = [
            'rounded-lg',
            'border-2',
            'px-4',
            'py-2',
            'font-medium',
            'transition-all',
            'duration-200',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-600',
            'focus:ring-offset-2',
        ];

        // 조건부 스타일 클래스들
        const conditionalStyles = isFilled
            ? [
                  'border-blue-600',
                  'bg-blue-600',
                  'text-white',
                  'hover:bg-blue-700',
                  'hover:border-blue-700',
                  disabled && 'opacity-50 hover:bg-blue-600 hover:border-blue-600',
              ]
            : [
                  'border-blue-600',
                  'bg-white',
                  'text-blue-600',
                  'hover:bg-blue-50',
                  disabled && 'opacity-50 hover:bg-white',
              ];

        // 사용자 정의 클래스와 기본 클래스 결합
        const combinedClassName = [
            ...baseStyles,
            ...conditionalStyles,
            disabled && 'cursor-not-allowed',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <button
                ref={ref}
                type={type}
                className={combinedClassName}
                onClick={clickEvent}
                disabled={disabled}
                {...props}
            >
                {text}
                {props.children}
            </button>
        );
    },
);

CommonButton.displayName = 'CommonButton';

export default CommonButton;
