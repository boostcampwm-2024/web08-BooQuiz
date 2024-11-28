/**
 * @description
 * 자식 요소들을 스타일이 적용된 div로 감싸는  컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <ContentBox>
 *   <p>이것은 ContentBox 안에 있는 내용입니다.</p>
 * </ContentBox>
 * ```
 *
 * @param {ContentBoxProps} props - ContentBox 컴포넌트의 props입니다.
 * @param {ReactNode} props.children - ContentBox 안에 감싸질 내용입니다.
 *
 * @returns {JSX.Element} 자식 요소들을 포함하는 스타일이 적용된 div를 반환합니다.
 */
import { ReactNode } from 'react';

interface ContentBoxProps {
    children: ReactNode;
    className?: string;
}

const ContentBox = ({ children, className }: ContentBoxProps) => {
    return (
        <div
            className={`p-4 box-border rounded-[10px] border-2 border-gray-200 flex flex-col ${className}`}
        >
            {children}
        </div>
    );
};
export default ContentBox;
