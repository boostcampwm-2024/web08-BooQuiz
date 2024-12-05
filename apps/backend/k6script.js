import http from 'k6/http';
import ws from 'k6/ws';
import { check, sleep } from 'k6';
// 첫 번째 방 시나리오

export function scenario1() {
    const httpResponse = http.get('https://booquiz.kro.kr/api/quiz-zone/loadtest');

    check(httpResponse, {
        'is status 200': (r) => r.status === 200,
        'is status 400': (r) => r.status === 400,
        'is status 500': (r) => r.status === 500,
    });

    const cookies = httpResponse.headers['Set-Cookie'];
    const sessionCookie = cookies ? cookies.split(';')[0] : '';

    sleep(1);

    const wsParams = {
        headers: {
            Cookie: sessionCookie,
        },
    };

    const wsResponse = ws.connect('wss://booquiz.kro.kr/api/play', wsParams, function (socket) {
        socket.on('open', () => {
            sleep(2);
            socket.send(
                JSON.stringify({
                    event: 'join',
                    data: { quizZoneId: 'loadtest' },
                }),
            );
        });

        socket.on('message', (data) => {
            data = JSON.parse(data);
            if (data.event === 'someone_join') {
                sleep(2);
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
        'WebSocket connected successfully (Room 1)': (r) => r && r.status === 101,
    });
}

// 두 번째 방 시나리오
export function scenario2() {
    const httpResponse = http.get('https://booquiz.kro.kr/api/quiz-zone/loadtest4');

    check(httpResponse, {
        'is status 200': (r) => r.status === 200,
        'is status 400': (r) => r.status === 400,
        'is status 500': (r) => r.status === 500,
    });

    const cookies = httpResponse.headers['Set-Cookie'];
    const sessionCookie = cookies ? cookies.split(';')[0] : '';

    sleep(1);

    const wsParams = {
        headers: {
            Cookie: sessionCookie,
        },
    };

    const wsResponse = ws.connect('wss://booquiz.kro.kr/api/play', wsParams, function (socket) {
        socket.on('open', () => {
            sleep(2);
            socket.send(
                JSON.stringify({
                    event: 'join',
                    data: { quizZoneId: 'loadtest4' },
                }),
            );
        });

        socket.on('message', (data) => {
            data = JSON.parse(data);
            if (data.event === 'someone_join') {
                sleep(2);
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
        'WebSocket connected successfully (Room 2)': (r) => r && r.status === 101,
    });
}
//
// export function scenario3() {
//     const httpResponse = http.get('https://booquiz.kro.kr/api/quiz-zone/loadtest3');
//     const cookies = httpResponse.headers['Set-Cookie'];
//     const sessionCookie = cookies ? cookies.split(';')[0] : '';
//
//     sleep(1);
//
//     const wsParams = {
//         headers: {
//             Cookie: sessionCookie,
//         },
//     };
//
//     const wsResponse = ws.connect('wss://booquiz.kro.kr/api/play', wsParams, function (socket) {
//         socket.on('open', () => {
//             sleep(2);
//             socket.send(
//                 JSON.stringify({
//                     event: 'join',
//                     data: { quizZoneId: 'loadtest3' },
//                 }),
//             );
//         });
//
//         socket.on('message', (data) => {
//             data = JSON.parse(data);
//             if (data.event === 'someone_join') {
//                 sleep(2);
//                 socket.send(
//                     JSON.stringify({
//                         event: 'chat',
//                         data: {
//                             clientId: wsParams.headers.Cookie,
//                             nickname: `${data.data.nickname}`,
//                             message: `안녕 나는 ${data.data.nickname}이야`,
//                         },
//                     }),
//                 );
//             }
//         });
//     });
//
//     check(wsResponse, {
//         'WebSocket connected successfully (Room 2)': (r) => r && r.status === 101,
//     });
// }

// 테스트 설정
export const options = {
    scenarios: {
        room1: {
            executor: 'ramping-vus',
            exec: 'scenario1', // 첫 번째 시나리오 실행
            startVUs: 0,
            stages: [{ duration: '1s', target: 300 }],
        },
        room2: {
            executor: 'ramping-vus',
            exec: 'scenario2', // 두 번째 시나리오 실행
            startVUs: 0,
            stages: [{ duration: '1s', target: 300 }],
        },
        // room3: {
        //     executor: 'ramping-vus',
        //     exec: 'scenario3', // 두 번째 시나리오 실행
        //     startVUs: 0,
        //     stages: [{ duration: '1s', target: 300 }],
        // },
    },
};
