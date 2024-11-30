import { forwardRef, ChangeEvent } from 'react';
import Typography from './Typogrpahy';

interface InputProps {
    type?: string;
    label?: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string | false;
    isUnderline?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isAutoFocus?: boolean;
    className?: string;
    isBorder?: boolean;
    step?: number;
    min?: number;
    max?: number;
    isShowCount?: boolean;
}

/**
 * `Input` 컴포넌트는 다양한 입력 필드를 렌더링합니다.
 *
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   label="Username"
 *   value={username}
 *   onChange={handleUsernameChange}
 *   name="username"
 *   placeholder="Enter your username"
 *   isAutoFocus={true}
 *   isBorder={true}
 * />
 * ```
 *
 * @param {string} type - 입력 필드의 타입 (기본값: 'text').
 * @param {string} label - 입력 필드의 레이블.
 * @param {string | number} value - 입력 필드의 값.
 * @param {function} onChange - 값이 변경될 때 호출되는 함수.
 * @param {string} name - 입력 필드의 이름.
 * @param {string} placeholder - 입력 필드의 플레이스홀더.
 * @param {boolean} disabled - 입력 필드를 비활성화할지 여부 (기본값: false).
 * @param {boolean} error - 에러 상태인지 여부 (기본값: false).
 * @param {boolean} isUnderline - 밑줄을 표시할지 여부 (기본값: false).
 * @param {function} onKeyDown - 키가 눌릴 때 호출되는 함수.
 * @param {boolean} isAutoFocus - 자동 포커스를 설정할지 여부 (기본값: false).
 * @param {string} className - 추가적인 클래스 이름.
 * @param {boolean} isBorder - 테두리를 표시할지 여부 (기본값: false).
 * @param {number} step - 입력 필드의 step 속성.
 * @param {number} min - 입력 필드의 최소값.
 * @param {number} max - 입력 필드의 최대값.
 * @param {boolean} isShowCount - 입력된 글자 수를 표시할지 여부.
 * @param {object} rest - 기타 전달할 속성들.
 * @returns {JSX.Element} 렌더링된 입력 필드 컴포넌트.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            type = 'text',
            label,
            value,
            onChange,
            name,
            placeholder,
            disabled = false,
            error = false,
            isUnderline = false,
            onKeyDown,
            isAutoFocus = false,
            className,
            isBorder = false,
            step,
            min,
            max,
            isShowCount,
            ...rest
        },
        ref,
    ) => {
        const classes = className ? `input-wrapper ${className}` : 'input-wrapper';
        return (
            <div className={classes}>
                <label htmlFor={name}>{label}</label>
                <input
                    ref={ref}
                    autoFocus={isAutoFocus}
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${error ? 'error' : ''} focus:outline-none w-full ${isBorder ? 'border border-gray-300' : ''} rounded-sm p-1`}
                    onKeyDown={onKeyDown}
                    step={step}
                    min={min}
                    max={max}
                    {...rest}
                />
                {error && <span className="error-message">{error}</span>}
                {isUnderline && <div className="underline h-[2px] w-full bg-blue-600" />}

                {typeof value == 'string' && isShowCount && (
                    <div className="w-full text-right pr-1">
                        <Typography text={value.length.toString() + '자'} color="gray" size="xs" />
                    </div>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
