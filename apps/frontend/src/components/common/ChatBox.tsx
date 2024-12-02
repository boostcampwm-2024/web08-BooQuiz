import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Input from '@/components/common/Input';
import { MessageCircle, Send } from 'lucide-react';

export interface ChatMessage {
    clientId: string;
    nickname: string;
    message: string;
}

interface ChatProps {
    clientId: string;
    nickname: string;
    sendHandler: (chatMessage: ChatMessage) => void;
    chatMessages: ChatMessage[];
    className?: string;
    disabled?: boolean;
}

const ChatBox = ({
    clientId,
    nickname,
    sendHandler,
    chatMessages,
    className,
    disabled = false,
}: ChatProps) => {
    const [message, setMessage] = useState('');
    const messageContainerRef = useRef<HTMLDivElement>(null);

    // 새 메시지가 추가될 때마다 채팅 영역 스크롤을 맨 아래로 이동
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            const { scrollHeight, clientHeight } = messageContainerRef.current;
            messageContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const chatMessage: ChatMessage = {
            clientId,
            nickname,
            message: message.trim(),
        };

        sendHandler(chatMessage);
        setMessage('');
    };

    return (
        <div
            className={`flex flex-col bg-white border rounded-lg h-full w-full 
            ${className}`}
        >
            <div className="p-4 border-b bg-gradient-to-r rounded-t-lg">
                <h2 className="font-semibold text-blue-500 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    실시간 채팅
                </h2>
            </div>

            {/* ref를 메시지 컨테이너에 직접 적용 */}
            <div
                ref={messageContainerRef}
                className="flex-1 p-4 overflow-y-auto bg-gray-50/50 min-h-[300px] space-y-4"
            >
                <div className="flex flex-col gap-3">
                    {chatMessages.map((chat, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-2 ${
                                chat.clientId === clientId ? 'flex-row-reverse' : ''
                            }`}
                        >
                            <div
                                className={`flex flex-col gap-1 ${
                                    chat.clientId === clientId ? 'items-end' : ''
                                }`}
                            >
                                <span className="text-sm font-medium text-gray-600">
                                    {chat.nickname}
                                    {chat.clientId === clientId && (
                                        <span className="ml-1 text-xs text-blue-500 font-normal">
                                            (나)
                                        </span>
                                    )}
                                </span>

                                <div
                                    className={`max-w-[240px] rounded-2xl px-4 py-2 break-words ${
                                        chat.clientId === clientId
                                            ? 'bg-blue-500 text-white shadow-sm'
                                            : 'bg-white border border-gray-200 text-gray-700 shadow-sm'
                                    }`}
                                >
                                    {chat.message}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full flex p-4 border-t bg-gray-50/30 rounded-b-lg lg:rounded-none items-center gap-3"
            >
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    name="chatInput"
                    disabled={disabled}
                    className="flex-1 bg-white shadow-sm border-gray-200 focus-visible:ring-blue-400 h-full p-2"
                />
                <Button
                    type="submit"
                    size="icon"
                    className={`bg-blue-500 hover:bg-blue-600 shadow-sm transition-all duration-200 ${
                        !message.trim() ? 'opacity-50' : 'hover:scale-105'
                    }`}
                    disabled={!message.trim()}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

export default ChatBox;
