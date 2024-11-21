import { useRef } from 'react';

const useWebSocket = (url: string, messageHandler: (event: MessageEvent) => void) => {
    const ws = useRef<WebSocket | null>(null);

    if (ws.current === null) {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onmessage = messageHandler;
    }

    const sendMessage = (message: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(message);
        } else {
            console.warn('WebSocket is not connected. Message not sent:', message);
        }
    };

    const closeConnection = () => {
        ws.current?.close();
    };

    return { sendMessage, closeConnection };
};

export default useWebSocket;
