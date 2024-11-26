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
import { getRandomNickName, PLAYER_STATE, QUIZ_ZONE_STAGE } from '../common/constants';
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
            nickname: getRandomNickName(),
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
            nickname: getRandomNickName(),
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

    /**
     *
     * @param quizZoneId - 대상 퀴즈 존 ID
     * @param clientId - 제외시킬 클라이언트 ID
     * @returns
     */
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
        const quizZone = await this.findOne(quizZoneId);
        quizZone.players.delete(clientId);
    }

    async updateQuizZone(quizZoneId: string, quizZone: QuizZone) {
        await this.repository.set(quizZoneId, {
            ...quizZone,
        });
    }
}
