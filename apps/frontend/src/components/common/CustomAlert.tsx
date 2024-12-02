import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import CustomAlertDialogContent from '@/components/common/CustomAlertDialogContent.tsx';

export interface CustomAlertProps {
    // 알럿 트리거 버튼 설정
    trigger: {
        text: string;
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
        size?: 'default' | 'sm' | 'lg' | 'icon';
        disabled?: boolean;
        icon?: React.ReactNode;
    };
    // 알럿 내용 설정
    alert: {
        title: string;
        description?: string;
        type?: 'info' | 'success' | 'warning' | 'error';
        cancelText?: string;
        confirmText?: string;
    };
    // 콜백 함수
    onConfirm: () => void;
    onCancel?: () => void;
    className?: string;
}

/**
 * @description
 * CustomAlert 컴포넌트는 사용자 정의 알림 대화 상자를 생성합니다.
 * 이 컴포넌트는 트리거 버튼을 클릭하면 나타나는 알림 대화 상자를 포함합니다.
 *
 * @example
 * ```tsx
 * <CustomAlert
 *   trigger={{ text: 'Delete', variant: 'destructive' }}
 *   alert={{ title: 'Are you sure?', description: 'This action cannot be undone.', type: 'warning' }}
 *   onConfirm={() => console.log('Confirmed')}
 *   onCancel={() => console.log('Cancelled')}
 * />
 * ```
 *
 * @param {Object} props - CustomAlert 컴포넌트의 속성
 * @param {Object} props.trigger - 알럿 트리거 버튼 설정
 * @param {string} props.trigger.text - 트리거 버튼의 텍스트
 * @param {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'} [props.trigger.variant] - 트리거 버튼의 스타일 변형
 * @param {'default' | 'sm' | 'lg' | 'icon'} [props.trigger.size] - 트리거 버튼의 크기
 * @param {boolean} [props.trigger.disabled] - 트리거 버튼의 비활성화 여부
 * @param {React.ReactNode} [props.trigger.icon] - 트리거 버튼에 표시할 아이콘
 * @param {Object} props.alert - 알럿 내용 설정
 * @param {string} props.alert.title - 알럿의 제목
 * @param {string} [props.alert.description] - 알럿의 설명
 * @param {'info' | 'success' | 'warning' | 'error'} [props.alert.type] - 알럿의 유형
 * @param {string} [props.alert.cancelText] - 취소 버튼의 텍스트
 * @param {string} [props.alert.confirmText] - 확인 버튼의 텍스트
 * @param {Function} props.onConfirm - 확인 버튼 클릭 시 호출되는 콜백 함수
 * @param {Function} [props.onCancel] - 취소 버튼 클릭 시 호출되는 콜백 함수
 *
 * @return {JSX.Element} 사용자 정의 알림 대화 상자 컴포넌트
 */
const CustomAlert = ({ trigger, alert, onConfirm, onCancel, className }: CustomAlertProps) => {
    const handleCancel = () => {
        onCancel?.();
    };

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={trigger.variant}
                    size={trigger.size}
                    disabled={trigger.disabled}
                    className={`rounded-[10px] ${className}`}
                >
                    {trigger.icon && <span className="mr-2">{trigger.icon}</span>}
                    {trigger.text}
                </Button>
            </AlertDialogTrigger>
            <CustomAlertDialogContent
                title={alert.title}
                description={alert.description}
                type={alert.type}
                cancelText={alert.cancelText}
                confirmText={alert.confirmText}
                handleCancel={handleCancel}
                handleConfirm={handleConfirm}
            />
        </AlertDialog>
    );
};

export default CustomAlert;
