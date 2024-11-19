import { useParams } from 'react-router-dom';

const NewQuizZonePage = () => {
    //QuizZoneId를 받아오기 위해 useParams 사용
    const QuizZoneId = useParams();
    console.log(QuizZoneId);

    //초기 데이터 불러오기
    //useEffect로 QuizZone 초기 데이터 불러오기

    //QuizZone 커스텀 훅 불러오기

    return (
        <div>
            <h1>New Quiz Zone Page</h1>
        </div>
    );
};

export default NewQuizZonePage;
