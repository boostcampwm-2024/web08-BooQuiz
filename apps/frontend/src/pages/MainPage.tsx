import CommonButton from '@/components/common/CommonButton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const handleMoveToMain = () => {
    navigate('/waiting');
  };

  return (
    <>
      <Button onClick={handleMoveToMain}>퀴즈존 참여하기</Button>
      <CommonButton text="퀴즈존 참여하기" isFulfill={true} clickEvent={void handleMoveToMain} />
    </>
  );
};

export default MainPage;
