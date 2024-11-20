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

const playTime = 30_000;
const MAX_PLAYERS = 10;
const quizzes: Quiz[] = [
    { question: '신이 화나면?', answer: '신발끈', playTime },
    { question: '도둑이 훔친 돈을 뭐라고 하는가?', answer: '슬그머니', playTime },
    { question: '털이 있는 동물들이 가장 좋아하는 장소는?', answer: '모텔', playTime },
    { question: '아몬드가 죽으면?', answer: '다이아몬드', playTime },
    { question: '왕이 넘어지면?', answer: '킹콩', playTime },
    { question: '바나나가 웃으면?', answer: '바나나킥', playTime },
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
            nickname: nickNames[0],
            score: 0,
            submits: [],
            state: 'WAIT',
        };

        const quizZone: QuizZone = {
            players: new Map<string, Player>([[hostId, player]]),
            title: '넌센스 퀴즈',
            description: '넌센스 퀴즈 입니다',
            hostId: hostId,
            maxPlayers: MAX_PLAYERS,
            quizzes: [...quizzes],
            stage: 'LOBBY',
            currentQuizIndex: -1,
            currentQuizStartTime: 0,
            currentQuizDeadlineTime: 0,
            intervalTime: 5000,
            submitCount: 0,
        };

        await this.repository.set(quizZoneId, quizZone);
    }

    /**
     * 퀴즈 존을 ID로 조회합니다.
     *
     * @param quizZoneId - 조회할 퀴즈 존의 ID
     * @returns 퀴즈 존 객체
     * @throws {NotFoundException} 퀴즈 존을 찾을 수 없는 경우
     */
    async findOne(quizZoneId: string): Promise<QuizZone> {
        const quizZone = this.repository.get(quizZoneId);

        if (quizZone === null) {
            throw new NotFoundException('퀴즈존 정보를 확인할 수 없습니다.');
        }

        return quizZone;
    }

    async getWaitingInfo(quizZoneId: string): Promise<WaitingQuizZoneDto> {
        const { title, description, quizzes, stage, hostId } = await this.findOne(quizZoneId);

        return {
            quizZoneTitle: title,
            quizZoneDescription: description,
            quizCount: quizzes.length,
            stage: stage,
            hostId: hostId,
        };
    }

    async setPlayerInfo(quizZoneId: string, sessionId: string) {
        const { players, maxPlayers } = await this.findOne(quizZoneId);
        const playerCount = players.size;

        if (players.has(sessionId)) {
            return;
        }

        if (playerCount >= maxPlayers) {
            throw new BadRequestException('퀴즈존 정원이 초과되었습니다.');
        }

        players.set(sessionId, {
            id: sessionId,
            nickname: nickNames[playerCount],
            score: 0,
            submits: [],
            state: 'WAIT',
        });
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

    async findOthersInfo(quizZoneId: string, sessionId: string) {
        const { players } = await this.findOne(quizZoneId);

        return [...players.values()]
            .filter((player) => player.id !== sessionId)
            .map(({ id, nickname }) => ({ nickname, id }));
    }
}
