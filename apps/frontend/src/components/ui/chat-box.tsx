import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Input from '@/components/common/Input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage } from '@/types/quizZone.types';
import { Send } from 'lucide-react';

/**
 * 채팅 컴포넌트
 *
 * @param url - WebSocket 서버 URL
 * @param clientId - 사용자의 세션 ID
 * @param quizZoneId - 퀴즈존 ID
 * @param nickname - 사용자의 닉네임
 * @param className - 컴포넌트에 적용할 CSS 클래스
 */

interface ChatProps {
    clientId: string;
    nickname: string;
    sendHandler: (chatMessage: ChatMessage) => void;
    chatMessages: ChatMessage[];
    className?: string;
}

const ChatBox = ({ clientId, nickname, sendHandler, chatMessages, className }: ChatProps) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        <div className={`flex flex-col h-[500px] w-full max-w-md border rounded-lg ${className}`}>
            <div className="p-4 border-b">
                <h2 className="font-semibold">채팅</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex flex-col gap-4">
                    {chatMessages.map((chat, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-2 ${
                                chat.clientId === clientId ? 'flex-row-reverse' : ''
                            }`}
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${chat.nickname}`}
                                />
                                <AvatarFallback>{chat.nickname[0]}</AvatarFallback>
                            </Avatar>

                            <div
                                className={`flex flex-col ${chat.clientId === clientId ? 'items-end' : ''}`}
                            >
                                <span className="text-sm text-gray-500">{chat.nickname}</span>
                                <div
                                    className={`max-w-[240px] rounded-lg p-2 break-words ${
                                        chat.clientId === clientId
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    {chat.message}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="w-full flex p-4 border-t">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    name="chatInput"
                    className="flex-1"
                />
                <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4"></Send>
                </Button>
            </form>
        </div>
    );
};

export default ChatBox;
