import { AlertDialog } from '../ui/alert-dialog';
import CustomAlertDialogContent from './CustomAlertDialogContent';

interface CustomAlertDialogProps {
    showError: boolean;
    setShowError: (show: boolean) => void;
    title: string;
    description?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const CustomAlertDialog = ({
    showError,
    setShowError,
    onConfirm,
    onCancel = () => {},
    title,
    description,
    confirmText = '확인',
    cancelText = '취소',
}: CustomAlertDialogProps) => {
    return (
        <AlertDialog open={showError} onOpenChange={setShowError}>
            <CustomAlertDialogContent
                title={title}
                description={description}
                type="error"
                confirmText={confirmText}
                handleConfirm={onConfirm}
                handleCancel={onCancel}
                cancelText={cancelText}
            />
        </AlertDialog>
    );
};

export default CustomAlertDialog;
