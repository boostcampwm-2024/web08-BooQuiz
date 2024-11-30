const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const SESSION_FILE = path.join(__dirname, 'sessions.json');
let sessions = [];
let currentIndex = 0;

// 세션 파일 초기화
if (fs.existsSync(SESSION_FILE)) {
    try {
        sessions = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
    } catch (err) {
        console.error('Error reading sessions file:', err);
        sessions = [];
    }
}

function generateRandomString(length) {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, length);
}

module.exports = {
    // HTTP 테스트에서 세션 생성 및 저장
    generateAndSaveSession: function (userContext, events, done) {
        const sessionData = generateRandomString(24);
        const signature = generateRandomString(32);
        const sessionId = `s%3A${sessionData}.${signature}`;

        // 세션 저장
        sessions.push(sessionId);
        fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions), 'utf8');

        // userContext에 저장
        userContext.vars.sessionId = sessionId;

        return done();
    },

    // WebSocket 테스트에서 저장된 세션 불러오기
    getStoredSession: function (userContext, events, done) {
        if (sessions.length === 0) {
            console.error('No stored sessions found');
            return done(new Error('No stored sessions available'));
        }

        // 순환적으로 세션 ID 사용
        const sessionId = sessions[currentIndex];
        currentIndex = (currentIndex + 1) % sessions.length;

        userContext.vars.sessionId = sessionId;

        return done();
    },

    // 테스트 종료 후 세션 파일 정리 (필요시 사용)
    cleanupSessions: function (userContext, events, done) {
        if (fs.existsSync(SESSION_FILE)) {
            fs.unlinkSync(SESSION_FILE);
        }
        sessions = [];
        currentIndex = 0;
        return done();
    },
};
