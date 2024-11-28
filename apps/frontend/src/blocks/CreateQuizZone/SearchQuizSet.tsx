import { ChangeEvent, useEffect, useState } from 'react';
import SearchQuizSetResults from '@/blocks/CreateQuizZone/SearchQuizSetResults.tsx';
import { requestSearchQuizSets } from '@/utils/requests.ts';
import { ResponseQuizSet } from '@/types/create-quiz-zone.types.ts';

interface SearchQuizSetProps {
    selectQuizSet: (quizSet: ResponseQuizSet) => void;
}

const SearchQuizSet = ({ selectQuizSet }: SearchQuizSetProps) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage] = useState(1);
    const [pageSize] = useState(10);

    const [resultCount, setResultCount] = useState(0);
    const [quizSets, setQuizSets] = useState<ResponseQuizSet[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const updateSearchQuizSet = async () => {
        try {
            setIsLoading(true);

            const { quizSets, totalQuizSetCount } = await requestSearchQuizSets({
                name: searchKeyword,
                page: currentPage.toString(),
                size: pageSize.toString(),
            });

            setQuizSets(quizSets);
            setResultCount(totalQuizSetCount);
        } catch (error) {
            // 얼럿 추가
            console.log(error);
            console.log('퀴즈셋 검색 처리중 오류가 발생하였습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        updateSearchQuizSet();
    }, []);

    function handleChangeSearchKeyword(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setSearchKeyword(value);
    }

    return (
        <div className="search-quiz-set">
            <label htmlFor="quiz-set-keyword" className="block">
                퀴즈셋 검색
            </label>
            <input
                type="text"
                className="quiz-zone-text-input-large"
                id="quiz-set-keyword"
                value={searchKeyword}
                placeholder="검색할 퀴즈셋의 이름을 입력하세요."
                onChange={handleChangeSearchKeyword}
            />
            <button onClick={updateSearchQuizSet}>검색하기</button>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <SearchQuizSetResults
                    results={quizSets}
                    total={resultCount}
                    selectQuizSet={selectQuizSet}
                />
            )}
        </div>
    );
};

export default SearchQuizSet;
