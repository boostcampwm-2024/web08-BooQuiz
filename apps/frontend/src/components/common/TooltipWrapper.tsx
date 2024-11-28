import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipWrapperProps {
    content: string;
    children: React.ReactNode;
    delayDuration?: number;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    className?: string;
    type?: 'button' | 'submit' | 'reset' | undefined;
}

const TooltipWrapper = ({
    content,
    children,
    delayDuration = 200,
    side = 'top',
    align = 'center',
    type = undefined,
}: TooltipWrapperProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={delayDuration}>
                <TooltipTrigger asChild type={type}>
                    <div>{children}</div>
                </TooltipTrigger>
                <TooltipContent
                    side={side}
                    align={align}
                    className="bg-slate-900 text-white px-3 py-1.5 text-sm rounded shadow-lg"
                >
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default TooltipWrapper;
