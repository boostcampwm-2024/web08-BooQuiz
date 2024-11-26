export interface TypographyProps {
    text: string;
    size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    color: 'gray' | 'red' | 'black' | 'blue';
    bold?: boolean;
}

/**
 * @description
 * `Typography` 컴포넌트는 Tailwind CSS를 사용하여 텍스트의 크기와 색상을 조절할 수 있도록 합니다.
 *
 * @component
 * @example
 * ```tsx
 * <Typography text="Hello World" size="lg" color="red" />
 * ```
 *
 * @param {TypographyProps} props - 컴포넌트에 전달되는 props
 * @param {string} props.text - 표시할 텍스트
 * @param {'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'} props.size - 텍스트의 크기
 * @param {'gray' | 'red' | 'black'} props.color - 텍스트의 색상
 *
 * @returns {JSX.Element} Tailwind CSS 클래스를 적용한 텍스트를 포함하는 `<p>` 요소
 */

const Typography = ({ text, size, color, bold = false }: TypographyProps) => {
    const sizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
    };

    const colorClasses = {
        gray: 'text-gray-400',
        red: 'text-red-600',
        blue: 'text-blue-600',
        black: 'text-black',
    };

    const classes = `break-all ${sizeClasses[size] || sizeClasses.base} ${colorClasses[color] || colorClasses.black} ${bold ? 'font-bold' : ''}`;
    return <p className={classes}>{text}</p>;
};

export default Typography;
