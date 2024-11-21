import { useRef } from 'react';

const useWebSocket = (url: string, messageHandler: (event: MessageEvent) => void) => {
    const ws = useRef<WebSocket | null>(null);
    const messageQueue = useRef<string[]>([]);

    if (ws.current === null) {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log('WebSocket connected');

            while (messageQueue.current.length > 0) {
                const message = messageQueue.current.shift()!;
                sendMessage(message);
            }
        };

        ws.current.onclose = (ev: CloseEvent) => {
            const { reason, wasClean } = ev;

            console.log(`WebSocket disconnected: ${reason}`);

            if (!wasClean) {
                location.reload();
            }
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
            messageQueue.current.push(message);
        }
    };

    const closeConnection = () => {
        ws.current?.close();
    };

    return { sendMessage, closeConnection };
};

export default useWebSocket;
