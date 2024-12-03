import { Component } from 'react';
import CustomAlertDialog from '@/components/common/CustomAlertDialog';
import { QuizZoneErrorType, quizZoneErrorMessages } from '@/types/error.types';
import { getQuizZoneErrorType } from '@/utils/errorUtils';

export interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: (args: { error: unknown; reset: () => void }) => React.ReactNode;
    handleError?: (error: unknown) => void;
    onReset?: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: unknown;
}

/**
 * ErrorBoundary는 자식 컴포넌트 트리에서 JavaScript 에러를 감지하고 처리하는 React 컴포넌트입니다.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {
        hasError: false,
        error: null,
    };

    static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: unknown) {
        this.props.handleError?.(error);
    }

    private resetError = () => {
        this.setState({
            hasError: false,
            error: null,
        });
        this.props.onReset?.();
    };

    render() {
        const { hasError, error } = this.state;
        const { children, fallback } = this.props;

        if (hasError) {
            if (fallback) {
                return fallback({ error, reset: this.resetError });
            }

            const errorType = getQuizZoneErrorType(error);
            const errorMessage =
                quizZoneErrorMessages[errorType as Exclude<QuizZoneErrorType, null>];

            return (
                <CustomAlertDialog
                    showError={true}
                    setShowError={() => this.resetError()}
                    onConfirm={this.resetError}
                    title={errorMessage.title}
                    description={errorMessage.description}
                    confirmText="확인"
                />
            );
        }

        return children;
    }
}
