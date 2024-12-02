import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx';

interface CustomAlertContentDialogProps {
    title: string;
    description?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    cancelText?: string;
    confirmText?: string;
    handleConfirm?: () => void;
    handleCancel?: () => void;
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

const CustomAlertDialogContent = ({
    title,
    description,
    type,
    confirmText,
    cancelText,
    handleConfirm,
    handleCancel,
}: CustomAlertContentDialogProps) => {
    return (
        <AlertDialogContent className={`border-2 ${getAlertStyle(type ?? 'info')}`}>
            <AlertDialogHeader className="gap-4">
                <div className="flex items-center gap-2">
                    {getAlertIcon(type ?? 'info')}
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                </div>
                {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancel}>{cancelText ?? '취소'}</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirm}>
                    {confirmText ?? '확인'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
};

export default CustomAlertDialogContent;
