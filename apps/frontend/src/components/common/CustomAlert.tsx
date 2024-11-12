import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

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
}

const getAlertIcon = (type: string) => {
    switch (type) {
        case 'success':
            return <CheckCircle2 className="h-6 w-6 text-[#22c55e]" />;
        case 'warning':
            return <AlertTriangle className="h-6 w-6 text-[#eab308]" />;
        case 'error':
            return <AlertCircle className="h-6 w-6 text-[#ef4444]" />;
        default:
            return <Info className="h-6 w-6 text-[#2563eb]" />;
    }
};

const getAlertStyle = (type: string) => {
    switch (type) {
        case 'success':
            return 'border-[#22c55e]/20 ';
        case 'warning':
            return 'border-[#eab308]/20';
        case 'error':
            return 'border-[#ef4444]/20 ';
        default:
            return 'border-[#2563eb]/20 ';
    }
};

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

const CustomAlert = ({ trigger, alert, onConfirm, onCancel }: CustomAlertProps) => {
    const handleCancel = () => {
        onCancel?.();
    };

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={trigger.variant} size={trigger.size} disabled={trigger.disabled}>
                    {trigger.icon && <span className="mr-2">{trigger.icon}</span>}
                    {trigger.text}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className={` border-2 ${getAlertStyle(alert.type ?? 'info')}`}>
                <AlertDialogHeader className="gap-4">
                    <div className="flex items-center gap-2">
                        {getAlertIcon(alert.type ?? 'info')}
                        <AlertDialogTitle>{alert.title}</AlertDialogTitle>
                    </div>
                    {alert.description && (
                        <AlertDialogDescription>{alert.description}</AlertDialogDescription>
                    )}
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>
                        {alert.cancelText ?? '취소'}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                        {alert.confirmText ?? '확인'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CustomAlert;
