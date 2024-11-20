import { AlertCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';

interface CustomAlertDialogProps {
    showError: boolean;
    setShowError: (show: boolean) => void;
    title: string;
    description?: string;
    onConfirm: () => void;
    confirmText?: string;
}

const CustomAlertDialog = ({
    showError,
    setShowError,
    onConfirm,
    title,
    description,
    confirmText = '확인',
}: CustomAlertDialogProps) => {
    return (
        <AlertDialog open={showError} onOpenChange={setShowError}>
            <AlertDialogContent className="border-2 border-[#ef4444]/20">
                <AlertDialogHeader className="gap-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-[#ef4444]" />
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CustomAlertDialog;
