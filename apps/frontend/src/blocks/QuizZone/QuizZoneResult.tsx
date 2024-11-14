import ContentBox from '@/components/common/ContentBox';
import CustomAlert from '@/components/common/CustomAlert';
import Typography from '@/components/common/Typogrpahy';
import { useNavigate } from 'react-router-dom';

interface QuizZoneResultProps {
    quizZoneData: any;
}

const QuizZoneResult = ({ quizZoneData }: QuizZoneResultProps) => {
    const navigate = useNavigate();
    const handleMoveToMain = () => {
        navigate('/');
    };
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <img className="w-[20rem]" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <Typography
                size="base"
                color="blue"
                text="퀴즈 풀이 하시느라 고생 많으셨습니다!"
                bold={true}
            />
            <ContentBox className="w-4/5 md:w-[48rem] grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContentBox>
                    <div className="flex flex-col gap-1">
                        <Typography size="lg" color="black" text={`최종 점수`} bold={true} />
                        <Typography
                            size="sm"
                            color="gray"
                            text={`참가하신 퀴즈존에서 획득한 점수를 확인하세요`}
                            bold={true}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row gap-1 items-end">
                            <Typography
                                size="4xl"
                                color="blue"
                                text={`${quizZoneData.result.score}`}
                                bold={true}
                            />
                            <Typography size="2xl" color="blue" text={`점`} bold={true} />
                        </div>
                        <Typography
                            size="sm"
                            color="gray"
                            text={`만점 ${quizZoneData.Lobby.totalQuizCount}점`}
                            bold={true}
                        />
                    </div>
                </ContentBox>
                <ContentBox>
                    <div className="flex flex-col gap-1">
                        <Typography size="lg" color="black" text={`정답률`} bold={true} />
                        <Typography
                            size="sm"
                            color="gray"
                            text={`참가하신 퀴즈존에서의 정답률을 확인하세요`}
                            bold={true}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row gap-1 items-end">
                            <Typography
                                size="4xl"
                                color="blue"
                                text={`${((quizZoneData.result.score / quizZoneData.Lobby.totalQuizCount) * 100).toFixed(2)}`}
                                bold={true}
                            />
                            <Typography size="2xl" color="blue" text={`%`} bold={true} />
                        </div>
                        <Typography
                            size="sm"
                            color="gray"
                            text={`${quizZoneData.result.score}/${quizZoneData.Lobby.totalQuizCount}문제`}
                            bold={true}
                        />
                    </div>
                </ContentBox>

                <CustomAlert
                    trigger={{
                        text: '나가기',
                        variant: 'outline',
                    }}
                    alert={{
                        title: '메인페이지로 이동하시겠습니까?',
                        description: '이 작업은 취소할 수 없습니다.',
                        type: 'info',
                    }}
                    onConfirm={() => handleMoveToMain()}
                    onCancel={() => {}}
                    className="col-span-full"
                />
            </ContentBox>
        </div>
    );
};

export default QuizZoneResult;
