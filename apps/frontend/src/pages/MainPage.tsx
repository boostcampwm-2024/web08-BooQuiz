import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Input from '@/components/common/Input';
import Typography from '@/components/common/Typogrpahy';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const [input, setInput] = useState('');

    const navigate = useNavigate();

    const handleMoveToQuizZone = () => {
        navigate(`/newQuizZone/${input}`);
    };

    //입장하기 버튼을 클릭하면 서버에 퀴즈존 세션 생성 요청을 날린다.
    // 퀴즈존 세션 생성 요청이 성공하면, 퀴즈존 대기실 정보 요청을 날린다.
    // 퀴즈존 대기실 정보를 받으면 퀴즈존 대기실으로 렌더링 한다.
    const handleCreateQuizZone = () => {
        fetch('/api/quiz-zone/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quizZoneId: input }),
        })
            .then((response) => {
                console.log(typeof response);
                console.log(response.status);
                if (response.status === 201) {
                    handleMoveToQuizZone();
                }
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    const handleMoveToQuizZoneLobby = () => {
        //baseURL 나중에 하기
        fetch(`/api/quiz-zone/${input}`, { method: 'GET' })
            .then((response) => {
                console.log(typeof response);
                console.log(response.status);
                if (response.status === 200) {
                    handleMoveToQuizZone();
                }
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <>
            <img src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <Typography
                size="2xl"
                color="blue"
                text="실시간 퀴즈 플랫폼 BooQuiz에 오신 것을 환영합니다!"
                bold={true}
            />
            <ContentBox className="w-4/5 md:w-[48rem]">
                <Typography size="base" color="blue" text="퀴즈 참여하기" bold={true} />
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    name="입장코드"
                    isAutoFocus={false}
                    placeholder="입장 코드를 5자리에서 10자리 까지 작성해주세요"
                />
                <Typography
                    size="xs"
                    color="gray"
                    text="버튼을 눌러 퀴즈존에 참여해보세요"
                    bold={true}
                />
                <CommonButton
                    text="퀴즈존 참여하기"
                    isFulfill={true}
                    clickEvent={handleMoveToQuizZoneLobby}
                />
                <CommonButton
                    text="퀴즈존 생성하기"
                    isFulfill={true}
                    clickEvent={handleCreateQuizZone}
                />
            </ContentBox>
        </>
    );
};

export default MainPage;
