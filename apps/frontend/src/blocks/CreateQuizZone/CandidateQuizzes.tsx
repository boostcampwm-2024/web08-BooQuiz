import Typography from '@/components/common/Typogrpahy';
import { Quiz } from '@/types/quizZone.types.ts';
import { Trash2 } from 'lucide-react';

interface CandidateQuizProps {
    quizzes: Quiz[];
    removeQuiz: (quiz: Quiz) => void;
}

const CandidateQuizzes = ({ quizzes, removeQuiz }: CandidateQuizProps) => {
    // 퀴즈 타입을 한글로 변환하는 함수
    const getQuizTypeText = (type: string) => {
        return type === 'SHORT' ? '단답형' : type;
    };

    return (
        <ul className="space-y-4">
            {quizzes.map((quiz, i) => (
                <li
                    key={i}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                    {/* 상단 정보 영역 */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-2">
                            {/* 퀴즈 타입 뱃지 */}
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {getQuizTypeText(quiz.quizType ?? '')}
                            </span>
                            {/* 시간 뱃지 */}
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                {quiz.playTime}초
                            </span>
                        </div>
                        {/* 삭제 버튼 */}
                        <button
                            onClick={() => removeQuiz(quiz)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                            aria-label="퀴즈 삭제"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    {/* 문제 내용 */}
                    <div className="mb-3 flex flex-row items-baseline gap-1 text-start">
                        <Typography text={`Q.`} color="gray" size="base" />
                        <Typography text={`${quiz.question}`} color="black" size="base" />
                    </div>

                    {/* 정답 */}
                    <div className="mb-3 flex flex-row gap-1 items-baseline">
                        <Typography text={`A.`} color="gray" size="base" />
                        <Typography text={`${quiz.answer}`} color="black" size="base" />
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default CandidateQuizzes;
