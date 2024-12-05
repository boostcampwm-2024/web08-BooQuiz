export enum QUIZ_ZONE_STAGE {
    LOBBY = 'LOBBY',
    IN_PROGRESS = 'IN_PROGRESS',
    RESULT = 'RESULT',
}

export enum PLAYER_STATE {
    WAIT = 'WAIT',
    PLAY = 'PLAY',
    SUBMIT = 'SUBMIT',
}

export const CLOSE_CODE = {
    NORMAL: 1000,
    GOING_AWAY: 1001,
    PROTOCOL_ERROR: 1002,
    REFUSE: 1003,
    NO_STATUS: 1005,
    ABNORMAL: 1006,
    INCONSISTENT_DATA: 1007,
    POLICY_VIOLATION: 1008,
};

// 닉네임 접두사
const prefixes: string[] = [
    '불사조',
    '천상의',
    '불의',
    '붉은',
    '어둠의',
    '달빛',
    '푸른',
    '검은',
    '황금의',
    '은빛',
    '새벽의',
    '태양의',
    '영원의',
    '바다의',
    '대지의',
    '하늘의',
    '강철의',
    '빛의',
    '고대의',
    '심연의',
    '구름의',
    '섬광의',
    '운명의',
    '폭풍의',
    '신비의',
    '얼음의',
    '화염의',
    '별의',
    '천둥의',
    '미친',
];

// 닉네임 접미사
const suffixes: string[] = [
    '마법사',
    '현자',
    '검사',
    '용사',
    '기사',
    '전사',
    '궁수',
    '암살자',
    '무사',
    '도적',
    '영웅',
    '제왕',
    '성자',
    '마왕',
    '기병',
    '법사',
    '검객',
    '마술사',
    '투사',
    '마수',
    '검투사',
    '마인',
    '왕',
    '사제',
    '괴수',
    '현자',
    '용자',
    '유령',
    '악마',
    '정령',
];

export const getRandomNickName = (): string => {
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

export enum QUIZ_TYPE {
    SHORT_ANSWER = 'SHORT',
}
