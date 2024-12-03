import http from 'k6/http';
import ws from 'k6/ws';
import { check, sleep } from 'k6';

// HTTP 요청 후 WebSocket 연결하는 통합 테스트
export default function () {
    // 세션 ID 생성
    const httpResponse = http.get('http://test.booquiz.kro.kr/api/quiz-zone/testtest');

    // 2. 응답 헤더에서 Set-Cookie를 확인합니다
    const cookies = httpResponse.headers['Set-Cookie'];
    const sessionCookie = cookies ? cookies.split(';')[0] : '';
    // console.log('Received session cookie:', sessionCookie);

    sleep(1);

    // 3. 받은 쿠키를 그대로 WebSocket 연결에 사용합니다
    const wsParams = {
        headers: {
            Cookie: sessionCookie,
        },
    };
    // console.log(httpResponse.headers);
    const wsResponse = ws.connect('ws://test.booquiz.kro.kr/api/play', wsParams, function (socket) {
        socket.on('open', () => {
            sleep(2);
            socket.send(
                JSON.stringify({
                    event: 'join',
                    data: { quizZoneId: 'testtest' },
                }),
            );
        });

        socket.on('message', (data) => {
            data = JSON.parse(data);
            console.log(data.event);
            if (data.event === 'someone_join') {
                sleep(2);
                // console.log(data);

                socket.send(
                    JSON.stringify({
                        event: 'chat',
                        data: {
                            clientId: wsParams.headers.Cookie,
                            nickname: `${data.data.nickname}`,
                            message: `안녕 나는 ${data.data.nickname}이야`,
                        },
                    }),
                );
            }
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
            stages: [{ duration: '3s', target: 5 }],
        },
    },
};
