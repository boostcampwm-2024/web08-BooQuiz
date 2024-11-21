import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { Player } from './entities/player.entity';
import { QuizZone } from './entities/quiz-zone.entity';
import { IQuizZoneRepository } from './repository/quiz-zone.repository.interface';
import { WaitingQuizZoneDto } from './dto/waiting-quiz-zone.dto';
import { PLAYER_STATE, QUIZ_ZONE_STAGE } from '../common/constants';
import { FindQuizZoneDto } from './dto/find-quiz-zone.dto';

const playTime = 30_000;
const MAX_PLAYERS = 10;
const quizzes: Quiz[] = [
    { question: '포도가 자기소개하면?', answer: '포도당', playTime },
    { question: '고양이를 싫어하는 동물은?', answer: '미어캣', playTime },
    { question: '게를 냉동실에 넣으면?', answer: '게으름', playTime },
    { question: '오리를 생으로 먹으면?', answer: '회오리', playTime },
    { question: '네 사람이 동시에 오줌을 누면?', answer: '포뇨', playTime },
    { question: '지브리가 뭘로 돈 벌게요?', answer: '토토로', playTime },
];

const nickNames: string[] = [
    '전설의고양이',
    '피카츄꼬리',
    '킹왕짱짱맨',
    '용맹한기사단',
    '무적의검사',
    '그림자암살자',
    '마법의마스터',
    '불꽃의전사',
    '어둠의기사',
    '번개의제왕',
    '달빛요정',
    '하늘의용사',
    '해적왕',
    '폭풍의드래곤',
    '빛나는영웅',
    '얼음마법사',
    '화염기사',
    '바람술사',
    '대지의수호자',
    '시간여행자',
    '은하수전사',
    '우주탐험가',
    '천상의기사',
    '구름정령',
    '빛의궁수',
    '암흑마법사',
    '번개도적',
    '불사조기사',
    '얼음여왕',
    '바다의왕자',
    '숲의요정',
    '황금기사',
    '천둥망치',
    '붉은검사',
    '달빛도둑',
    '푸른드래곤',
    '별의마법사',
    '무지개전사',
    '신비한현자',
    '폭풍기사',
    '자연의수호자',
    '빙하의마법사',
    '불꽃검사',
    '바람의정령',
    '대지의기사',
    '시간의현자',
    '우주의전사',
    '천상의마법사',
    '구름기사',
    '빛의현자',
    '어둠의검사',
    '번개의마법사',
    '불사조마법사',
    '얼음기사',
    '파도의전사',
    '숲의현자',
    '황금마법사',
    '천둥기사',
    '붉은마법사',
    '달빛기사',
    '푸른마법사',
    '별의기사',
    '무지개마법사',
    '신비한기사',
    '폭풍마법사',
    '자연의기사',
    '빙하의전사',
    '불꽃마법사',
    '바람의기사',
    '대지의마법사',
    '시간의기사',
    '우주의마법사',
    '천상의검사',
    '구름마법사',
    '빛의마법사',
    '어둠의현자',
    '번개의검사',
    '불사조현자',
    '얼음현자',
    '파도의기사',
    '숲의기사',
    '황금현자',
    '천둥현자',
    '붉은현자',
    '달빛현자',
    '푸른현자',
    '별의현자',
    '무지개현자',
    '신비한검사',
    '폭풍현자',
    '자연의현자',
    '빙하의기사',
    '불꽃현자',
    '바람의현자',
    '대지의현자',
    '시간의검사',
    '우주의현자',
    '천상의현자',
    '구름현자',
    '빛의검사',
    '어둠의드래곤',
    '번개의현자',
    '불사조검사',
    '얼음드래곤',
    '파도의현자',
    '숲의마법사',
    '황금검사',
    '천둥검사',
    '붉은드래곤',
    '달빛마법사',
];

@Injectable()
export class QuizZoneService {
    constructor(
        @Inject('QuizZoneRepository')
        private readonly repository: IQuizZoneRepository,
    ) {}

    /**
     * 새로운 퀴즈 존을 생성합니다.
     *
     * @param quizZoneId - 등록될 퀴즈존 ID
     * @param hostId
     * @returns 퀴즈 존을 생성하고 저장하는 비동기 작업
     * @throws(ConflictException) 이미 저장된 ID인 경우 예외 발생
     */
    async create(quizZoneId: string, hostId: string): Promise<void> {
        const hasQuizZone = await this.repository.has(quizZoneId);

        if (hasQuizZone) {
            throw new ConflictException('이미 존재하는 퀴즈존입니다.');
        }

        const player: Player = {
            id: hostId,
            nickname: nickNames[Math.floor(Math.random() * nickNames.length)],
            score: 0,
            submits: [],
            state: PLAYER_STATE.WAIT,
        };

        const encodedQuizzes = quizzes.map((quiz) => ({
            ...quiz,
            question: Buffer.from(quiz.question).toString('base64'),
        }));

        const quizZone: QuizZone = {
            players: new Map<string, Player>([[hostId, player]]),
            title: '넌센스 퀴즈',
            description: '넌센스 퀴즈 입니다',
            hostId: hostId,
            maxPlayers: MAX_PLAYERS,
            quizzes: encodedQuizzes,
            stage: QUIZ_ZONE_STAGE.LOBBY,
            currentQuizIndex: -1,
            currentQuizStartTime: 0,
            currentQuizDeadlineTime: 0,
            intervalTime: 3000,
            submitCount: 0,
        };

        await this.repository.set(quizZoneId, quizZone);
    }

    async getQuizZoneInfo(clientId: string, quizZoneId: string) {
        const quizZoneStage = await this.getQuizZoneStage(quizZoneId);

        if (quizZoneStage === QUIZ_ZONE_STAGE.LOBBY) {
            await this.setPlayerInfo(clientId, quizZoneId);
            return this.getLobbyInfo(clientId, quizZoneId);
        }

        if (quizZoneStage === QUIZ_ZONE_STAGE.IN_PROGRESS) {
            await this.checkValidPlayer(clientId, quizZoneId);
            return this.getProgressInfo(clientId, quizZoneId);
        }
        if (quizZoneStage === QUIZ_ZONE_STAGE.RESULT) {
            await this.checkValidPlayer(clientId, quizZoneId);
            return this.getResultInfo(clientId, quizZoneId);
        }
    }

    /**
     * 퀴즈 존을 ID로 조회합니다.
     *
     * @param quizZoneId - 조회할 퀴즈 존의 ID
     * @returns 퀴즈 존 객체
     * @throws {NotFoundException} 퀴즈 존을 찾을 수 없는 경우
     */
    async findOne(quizZoneId: string): Promise<QuizZone> {
        const quizZone = await this.repository.get(quizZoneId);

        if (!quizZone) {
            throw new NotFoundException('퀴즈존 정보를 확인할 수 없습니다.');
        }

        return quizZone;
    }

    private async getLobbyInfo(clinetId: string, quizZoneId: string): Promise<FindQuizZoneDto> {
        const { players, title, description, quizzes, stage, hostId } =
            await this.findOne(quizZoneId);
        const { id, nickname, state } = players.get(clinetId);

        return {
            currentPlayer: { id, nickname, state },
            title: title,
            description: description,
            quizCount: quizzes.length,
            stage: stage,
            hostId: hostId,
        };
    }

    private async getProgressInfo(clientId: string, quizZoneId: string): Promise<FindQuizZoneDto> {
        const {
            players,
            stage,
            currentQuizIndex,
            currentQuizStartTime,
            currentQuizDeadlineTime,
            hostId,
            title,
            description,
            intervalTime,
        } = await this.findOne(quizZoneId);
        const { id, nickname, state } = players.get(clientId);

        return {
            currentPlayer: { id, nickname, state },
            title,
            description,
            quizCount: quizzes.length,
            stage,
            hostId: hostId,
            currentQuiz: {
                currentIndex: currentQuizIndex,
                startTime: currentQuizStartTime,
                deadlineTime: currentQuizDeadlineTime,
                playTime: quizzes[currentQuizIndex].playTime,
                question: quizzes[currentQuizIndex].question,
                stage: stage,
            },
        };
    }

    private async getResultInfo(clientId: string, quizZoneId: string): Promise<FindQuizZoneDto> {
        const { players, stage, title, description, hostId } = await this.findOne(quizZoneId);
        const { id, nickname, state, submits, score } = players.get(clientId);

        return {
            currentPlayer: { id, nickname, state, score, submits },
            title,
            description,
            quizCount: quizzes.length,
            stage: stage,
            hostId,
        };
    }

    private async setPlayerInfo(clientId: string, quizZoneId: string) {
        const { players, maxPlayers } = await this.findOne(quizZoneId);
        const playerCount = players.size;

        // 이미 참가한 플레이어인 경우 그냥 리턴
        if (players.has(clientId)) {
            return;
        }

        // 정원 초과인 경우 예외 발생
        if (playerCount >= maxPlayers) {
            throw new BadRequestException('퀴즈존 정원이 초과되었습니다.');
        }

        players.set(clientId, {
            id: clientId,
            nickname: nickNames[Math.floor(Math.random() * nickNames.length)],
            score: 0,
            submits: [],
            state: PLAYER_STATE.WAIT,
        });
    }

    private async checkValidPlayer(clientId: string, quizZoneId: string) {
        const { players } = await this.findOne(quizZoneId);

        if (!players.has(clientId)) {
            throw new BadRequestException('참가하지 않은 플레이어입니다.');
        }
    }

    /**
     * 퀴즈 존을 삭제합니다.
     *
     * @param quizZoneId - 삭제할 퀴즈 존의 ID
     * @returns 퀴즈 존 삭제 작업
     */
    async clearQuizZone(quizZoneId: string): Promise<void> {
        const hasQuizZone = await this.repository.has(quizZoneId);

        if (!hasQuizZone) {
            throw new BadRequestException('존재하지 않는 퀴즈존입니다.');
        }

        await this.repository.delete(quizZoneId);
    }

    async findOthersInfo(quizZoneId: string, clientId: string) {
        const { players } = await this.findOne(quizZoneId);

        return [...players.values()]
            .filter((player) => player.id !== clientId)
            .map(({ id, nickname }) => ({ nickname, id }));
    }

    async getQuizZoneStage(quizZoneId: string) {
        const { stage } = await this.findOne(quizZoneId);

        return stage;
    }

    async leave(quizZoneId: string, clientId: any) {
        const quizZone = await this.repository.get(quizZoneId);
        quizZone.players.delete(clientId);
    }
}
