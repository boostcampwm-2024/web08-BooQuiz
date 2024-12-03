import { Button } from '@/components/ui/button';
import TooltipWrapper from './TooltipWrapper';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="h-16 fixed top-0 left-0 right-0 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-50 overflow-hidden">
            <div className="max-w-screen-xl px-2">
                <div className="flex h-16 items-center justify-between">
                    <TooltipWrapper content="홈으로 이동">
                        <Button
                            variant="ghost"
                            className="text-xl font-bold p-0"
                            onClick={() => navigate('/')}
                        >
                            <Logo className="min-w-32" color="#2563eb" />
                        </Button>
                    </TooltipWrapper>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
