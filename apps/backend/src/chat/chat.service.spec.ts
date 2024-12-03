import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';

describe('ChatService', () => {
    let service: ChatService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChatService,
                {
                    provide: 'ChatRepository',
                    useValue: {
                        /* mock implementation */
                    },
                },
            ],
        }).compile();

        service = module.get<ChatService>(ChatService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
