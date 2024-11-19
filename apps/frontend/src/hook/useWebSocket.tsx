import { useEffect } from 'react';

const useWebSocket = (url: string, messageHandler: (event: MessageEvent) => void) => {
    const ws = new WebSocket(url);

    useEffect(() => {
        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error', error);
        };

        // 메시지 수신 처리
        ws.onmessage = (event) => {
            messageHandler(event);
        };

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = (message: string) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        } else {
            console.error('WebSocket is not open');
        }
    };

    return { sendMessage };
};

export default useWebSocket;
