import { forwardRef, ChangeEvent } from 'react';

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
}

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
            ...rest
        },
        ref,
    ) => {
        return (
            <div className="input-wrapper">
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
                    className={`${error ? 'error' : ''} focus:outline-none w-full`}
                    onKeyDown={onKeyDown}
                    {...rest}
                />
                {error && <span className="error-message">{error}</span>}
                {isUnderline && <div className="underline h-[2px] w-full bg-blue-600" />}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
