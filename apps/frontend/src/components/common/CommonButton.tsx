import { Button } from '../ui/button';

//Text
//hover
//hover backgourdcolor, color

interface CommonButtonProps {
    text: string;
    isHover: boolean;
}

const CommonButton = ({ text, isHover }: CommonButtonProps) => {
    return <Button className={``}></Button>;
};

export default CommonButton;
