import { ResponseQuizSet } from '@/blocks/CreateQuizZone/SearchQuizSet.tsx';

interface SearchQuizSetResultsProp {
    results: ResponseQuizSet[];
    selectQuizSet: (quizSet: ResponseQuizSet) => void;
    total: number;
}

const SearchQuizSetResults = ({ results, selectQuizSet, total }: SearchQuizSetResultsProp) => {
    return (
        <div>
            <div>
                <strong>검색 결과 {total}건</strong>
            </div>
            {results.length <= 0 ? (
                <div>검색 결과가 없습니다. 새로운 퀴즈셋을 만들어보세요.</div>
            ) : (
                <div>
                    <p>검색 결과를 클릭하면 상세 정보를 확인할 수 있습니다.</p>
                    <ul className="search-quiz-set-results">
                        {results.map((result) => (
                            <li key={result.id} className="create-quiz-set-result">
                                <button onClick={() => selectQuizSet(result)}>{result.name}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchQuizSetResults;
