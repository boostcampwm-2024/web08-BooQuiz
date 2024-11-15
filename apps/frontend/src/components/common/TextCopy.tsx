import Typography, { TypographyProps } from './Typogrpahy';
import { Copy } from 'lucide-react';

export interface TextCopyProps {
    text: string;
    size?: TypographyProps['size'];
    bold?: TypographyProps['bold'];
}

/**
 * @description
 * 주어진 텍스트를 복사할 수 있는 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <TextCopy text="복사할 텍스트" size="2xl" />
 * ```
 *
 * @param text - 복사할 텍스트입니다.
 * @param size - 텍스트의 크기를 지정합니다. 기본값은 '4xl'입니다.
 * @returns 주어진 텍스트와 복사 아이콘을 포함하는 컴포넌트를 반환합니다.
 */
const TextCopy = ({ text, size = '4xl', bold = false }: TextCopyProps) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="flex flex-row gap-2 items-center">
            <Typography text={text} color="black" size={size} bold={bold} />
            <Copy
                onClick={handleCopy}
                className="active:scale-105 trasition-all cursor-pointer h-1/2 hover:scale-125"
            />
        </div>
    );
};

export default TextCopy;
