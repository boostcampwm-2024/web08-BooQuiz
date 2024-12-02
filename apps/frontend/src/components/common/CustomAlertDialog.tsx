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
}

const CustomAlertDialog = ({
    showError,
    setShowError,
    onConfirm,
    onCancel = () => {},
    title,
    description,
    confirmText = '확인',
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
            />
        </AlertDialog>
    );
};

export default CustomAlertDialog;
