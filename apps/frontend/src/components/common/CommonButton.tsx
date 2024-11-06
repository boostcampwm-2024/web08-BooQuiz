import { Button } from '../ui/button';

interface CommonButtonProps {
  text?: string;
  isFulfill: boolean;
  clickEvent?: void;
  width?: string;
  height?: string;
}

const CommonButton = ({ text, isFulfill, clickEvent }: CommonButtonProps) => {
  const backgroundColorClass = isFulfill ? 'bg-blue-600' : 'bg-white';
  const textColorClass = isFulfill ? 'text-white' : 'text-[#3565e3]';
  const hoverBackgroundColorClass = isFulfill ? 'hover:bg-blue-800' : 'hover:bg-[#f5f5f5]';

  return (
    <Button
      className={`w-[557px] h-[47px] rounded-[10px] border-2 border-[#3565e3] ${backgroundColorClass} ${textColorClass} ${hoverBackgroundColorClass}`}
      onClick={void clickEvent}
    >
      {text}
    </Button>
  );
};

export default CommonButton;
