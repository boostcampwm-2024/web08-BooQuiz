import http from 'k6/http';
import ws from 'k6/ws';
import { check, sleep } from 'k6';

// HTTP 요청 후 WebSocket 연결하는 통합 테스트
export default function () {
    // 세션 ID 생성
    const httpResponse = http.get('http://localhost:3000/quiz-zone/loadtest');

    // 2. 응답 헤더에서 Set-Cookie를 확인합니다
    const cookies = httpResponse.headers['Set-Cookie'];
    const sessionCookie = cookies ? cookies.split(';')[0] : '';
    console.log('Received session cookie:', sessionCookie);

    sleep(1);

    // 3. 받은 쿠키를 그대로 WebSocket 연결에 사용합니다
    const wsParams = {
        headers: {
            Cookie: sessionCookie,
        },
    };
    // console.log(httpResponse.headers);
    const wsResponse = ws.connect('ws://localhost:3000/play', wsParams, function (socket) {
        socket.on('open', () => {
            console.log('WebSocket connected');
            socket.send(
                JSON.stringify({
                    event: 'join',
                    data: { quizZoneId: 'loadtest' },
                }),
            );
        });

        socket.on('message', (data) => {
            console.log('Message received:', data);
        });
    });

    check(wsResponse, {
        'WebSocket connected successfully': (r) => r && r.status === 101,
    });
}

// 테스트 설정
export const options = {
    scenarios: {
        contacts: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [{ duration: '10s', target: 200 }],
        },
    },
};
