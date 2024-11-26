import { ChangeEvent } from 'react';

interface InputProps {
    type?: string;
    label?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string | false;
    isUnderline?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isAutoFocus?: boolean;
    className?: string;
}

/**
 * @description
 * Input 컴포넌트는 다양한 타입의 입력 필드를 렌더링합니다.
 *
 * @component
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   label="Username"
 *   value={username}
 *   onChange={handleUsernameChange}
 *   name="username"
 *   placeholder="Enter your username"
 *   error={usernameError}
 *   isUnderline={true}
 * />
 * ```
 *
 * @param {Object} props - Input 컴포넌트의 props
 * @param {string} [props.type='text'] - 입력 필드의 타입
 * @param {string} [props.label] - 입력 필드의 라벨
 * @param {string} props.value - 입력 필드의 값
 * @param {function} props.onChange - 입력 필드 값이 변경될 때 호출되는 함수
 * @param {string} props.name - 입력 필드의 이름
 * @param {string} [props.placeholder] - 입력 필드의 플레이스홀더
 * @param {boolean} [props.disabled=false] - 입력 필드의 비활성화 여부
 * @param {string|false} [props.error=false] - 입력 필드의 에러 메시지
 * @param {boolean} [props.isUnderline=false] - 입력 필드 하단에 밑줄을 표시할지 여부
 * @param {Object} [props.rest] - 추가적인 props
 *
 * @returns {JSX.Element} 렌더링된 Input 컴포넌트
 */
const Input = ({
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
    ...rest
}: InputProps) => {
    const classes = className ? `input-wrapper ${className}` : 'input-wrapper';
    return (
        <div className={classes}>
            <label htmlFor={name}>{label}</label>
            <input
                autoFocus={isAutoFocus}
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`${error ? 'error' : ''} focus:outline-none w-full`}
                onKeyDown={onKeyDown}
                {...rest}
            />
            {error && <span className="error-message">{error}</span>}
            {isUnderline && <div className="underline h-[2px] w-full bg-blue-600" />}
        </div>
    );
};

export default Input;
