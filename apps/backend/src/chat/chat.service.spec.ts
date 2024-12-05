import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { NotFoundException } from '@nestjs/common';
import { ChatMessage } from './entities/chat-message.entity';

describe('ChatService', () => {
    let service: ChatService;
    let chatRepository: { [key: string]: jest.Mock };

    beforeEach(async () => {
        chatRepository = {
            set: jest.fn(),
            get: jest.fn(),
            add: jest.fn(),
            has: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChatService,
                {
                    provide: 'ChatRepository',
                    useValue: chatRepository,
                },
            ],
        }).compile();

        service = module.get<ChatService>(ChatService);
    });

    it('정의되어 있어야 합니다', () => {
        expect(service).toBeDefined();
    });

    it('채팅방을 설정할 수 있어야 합니다', async () => {
        await service.set('room1');
        expect(chatRepository.set).toHaveBeenCalledWith('room1');
    });

    it('채팅 메시지를 가져올 수 있어야 합니다', async () => {
        const chatMessage: ChatMessage = { clientId: '1', message: 'Hello', nickname: 'nickname1' };
        chatRepository.get.mockResolvedValue([chatMessage]);
        chatRepository.has.mockResolvedValue(true);

        const messages = await service.get('room1');
        expect(messages).toEqual([chatMessage]);
    });

    it('채팅 메시지를 추가할 수 있어야 합니다', async () => {
        const chatMessage: ChatMessage = { clientId: '1', message: 'Hello', nickname: 'nickname1' };
        chatRepository.has.mockResolvedValue(true);

        await service.add('room1', chatMessage);
        expect(chatRepository.add).toHaveBeenCalledWith('room1', chatMessage);
    });

    it('존재하지 않는 채팅방에 메시지를 추가하려고 하면 예외가 발생해야 합니다', async () => {
        const chatMessage: ChatMessage = { clientId: '1', message: 'Hello', nickname: 'nickname1' };
        chatRepository.has.mockResolvedValue(false);

        await expect(service.add('room1', chatMessage)).rejects.toThrow(NotFoundException);
    });

    it('채팅 메시지가 존재하는지 확인할 수 있어야 합니다', async () => {
        await chatRepository.has.mockResolvedValue(true);

        const hasMessages = await service.has('room1');
        expect(hasMessages).toBe(true);
    });

    it('채팅 메시지를 삭제할 수 있어야 합니다', async () => {
        await service.delete('room1');
        expect(chatRepository.delete).toHaveBeenCalledWith('room1');
    });

    it('존재하지 않는 채팅방에 메시지를 가져오려고 하면 예외가 발생해야 합니다', async () => {
        await chatRepository.has.mockResolvedValue(false);

        await expect(service.get('room1')).rejects.toThrow(NotFoundException);
    });
});
