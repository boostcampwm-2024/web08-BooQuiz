import { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export interface AsyncBoundaryProps {
    children: React.ReactNode;
    pending: React.ReactNode;
    rejected?: (args: { error: unknown; retry: () => void }) => React.ReactNode;
    handleError?: (error: unknown) => void;
    onReset?: () => void;
}

/**
 * AsyncBoundary는 비동기 작업의 로딩 상태와 에러를 처리하는 컴포넌트입니다.
 */
export function AsyncBoundary(props: AsyncBoundaryProps) {
    const { children, pending, rejected, handleError, onReset } = props;

    return (
        <ErrorBoundary
            fallback={rejected && (({ error, reset }) => rejected({ error, retry: reset }))}
            handleError={handleError}
            onReset={onReset}
        >
            <Suspense fallback={pending}>{children}</Suspense>
        </ErrorBoundary>
    );
}
