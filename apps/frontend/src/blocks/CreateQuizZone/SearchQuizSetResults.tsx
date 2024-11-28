import { ResponseQuizSet } from '@/types/create-quiz-zone.types.ts';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface SearchQuizSetResultsProp {
    results: ResponseQuizSet[];
    selectQuizSet: (quizSet: ResponseQuizSet) => void;
    total: number;
}

const SearchQuizSetResults = ({ results, selectQuizSet, total }: SearchQuizSetResultsProp) => {
    return (
        <div className="space-y-4">
            <div className="font-semibold mt-4">
                검색 결과 <span className="text-primary">{total}</span>건
            </div>

            {results.length <= 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    검색 결과가 없습니다. 새로운 퀴즈셋을 만들어보세요.
                </div>
            ) : (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">퀴즈셋을 선택해주세요.</p>
                    <ul className="divide-y divide-border rounded-lg border">
                        {results.map((result) => (
                            <li
                                key={result.id}
                                className="flex items-center justify-between px-2 py-1 hover:bg-accent/50 transition-colors"
                            >
                                <span className="font-medium truncate">{result.name}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => selectQuizSet(result)}
                                    className="ml-2 text-primary"
                                >
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchQuizSetResults;
