import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';

interface QuizZoneLoadingProps {
    title?: string;
    description?: string;
}

const QuizZoneLoading = ({
    title = '결과를 정산하고 있습니다...',
    description = '잠시만 기다려주세요',
}: QuizZoneLoadingProps) => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <ContentBox className="w-full max-w-2xl p-8 flex flex-col items-center justify-center">
                <Typography size="lg" color="blue" text={title} bold={true} />
                <Typography size="base" color="gray" text={description} />
            </ContentBox>
        </div>
    );
};
export default QuizZoneLoading;
