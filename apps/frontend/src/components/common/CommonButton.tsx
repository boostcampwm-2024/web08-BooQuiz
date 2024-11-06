import { Button } from '../ui/button';
interface CommonButtonProps {
    text?: string;
    isFulfill: boolean;
    clickEvent?: void;
    width?: string;
    height?: string;
}

/**
 * 공통 버튼 컴포넌트
 *
 * @description 이 컴포넌트는 다양한 스타일과 클릭 이벤트를 지원하는 공통 버튼을 생성합니다.
 *
 * @example
 * ```tsx
 * <CommonButton text="클릭하세요" isFulfill={true} clickEvent={handleClick} />
 * ```
 *
 * @param {Object} props - 컴포넌트의 props
 * @param {string} props.text - 버튼에 표시될 텍스트
 * @param {boolean} props.isFulfill - 버튼의 스타일을 결정하는 플래그
 * @param {void} props.clickEvent - 버튼 클릭 시 실행될 이벤트 핸들러
 *
 * @returns {JSX.Element} 스타일이 적용된 버튼 컴포넌트
 */
const CommonButton = ({ text, isFulfill, clickEvent }: CommonButtonProps) => {
    const backgroundColorClass = isFulfill ? 'bg-blue-600' : 'bg-white';
    const textColorClass = isFulfill ? 'text-white' : 'text-[#3565E3]';
    const hoverBackgroundColorClass = isFulfill ? 'hover:bg-blue-800' : 'hover:bg-[#F5F5F5]';
    return (
        <Button
            className={`w-[557px] h-[47px] rounded-[10px] border-2 border-[#3565E3] ${backgroundColorClass} ${textColorClass} ${hoverBackgroundColorClass}`}
            onClick={void clickEvent}
        >
            {text}
        </Button>
    );
};
export default CommonButton;
