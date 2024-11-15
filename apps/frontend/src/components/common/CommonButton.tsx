import { Button } from '../ui/button';

export interface CommonButtonProps {
    text?: string;
    isFulfill?: boolean;
    clickEvent: () => void;
    width?: string;
    height?: string;
    disabled?: boolean;
    className?: string;
}

const CommonButton = ({
    text,
    isFulfill = false,
    clickEvent,
    disabled = false,
    className,
}: CommonButtonProps) => {
    const backgroundColorClass = isFulfill ? 'bg-blue-600' : 'bg-white';
    const textColorClass = isFulfill ? 'text-white' : 'text-[#3565e3]';
    const hoverBackgroundColorClass = isFulfill ? 'hover:bg-blue-800' : 'hover:bg-[#f5f5f5]';

    return (
        <Button
            className={`${disabled ? 'disabled' : ''} rounded-[10px] border-2 border-[#3565e3] ${backgroundColorClass} ${textColorClass} ${hoverBackgroundColorClass} ${className}`}
            onClick={() => clickEvent()}
        >
            {text}
        </Button>
    );
};

export default CommonButton;
