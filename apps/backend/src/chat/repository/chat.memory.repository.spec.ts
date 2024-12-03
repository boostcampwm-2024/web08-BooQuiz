import { ChatRepositoryMemory } from './chat.memory.repository';
import { ChatMessage } from '../entities/chat-message.entity';

// ChatRepositoryMemory 테스트 파일
describe('ChatRepositoryMemory', () => {
    let repository: ChatRepositoryMemory;
    let chatStorage: Map<string, ChatMessage[]>;

    beforeEach(() => {
        chatStorage = new Map();
        repository = new ChatRepositoryMemory(chatStorage);
    });

    it('채팅 레포지토리가 정의되어 있어야 합니다', () => {
        expect(repository).toBeDefined();
    });

    it('채팅 메시지를 추가할 수 있어야 합니다', async () => {
        const chatMessage: ChatMessage = { clientId: '1', message: 'Hello', nickname: 'nickname1' };
        await repository.add('room1', chatMessage);

        const messages = await repository.get('room1');
        expect(messages).toEqual([chatMessage]);
    });

    it('채팅 메시지를 가져올 수 있어야 합니다', async () => {
        const chatMessage: ChatMessage = { clientId: '1', message: 'Hello', nickname: 'nickname1' };
        chatStorage.set('room1', [chatMessage]);

        const messages = await repository.get('room1');
        expect(messages).toEqual([chatMessage]);
    });

    it('메시지가 없으면 undefined를 반환해야 합니다', async () => {
        const messages = await repository.get('room2');
        expect(messages).toBeNull();
    });

    it('채팅 메시지를 삭제할 수 있어야 합니다', async () => {
        const chatMessage: ChatMessage = { clientId: '1', message: 'Hello', nickname: 'nickname1' };
        chatStorage.set('room1', [chatMessage]);

        await repository.delete('room1');
        const messages = await repository.get('room1');
        expect(messages).toBeNull();
    });

    it('채팅 메시지가 존재하는지 확인할 수 있어야 합니다', async () => {
        const chatMessage: ChatMessage = { clientId: '1', message: 'Hello', nickname: 'nickname1' };
        chatStorage.set('room1', [chatMessage]);

        const hasMessages = await repository.has('room1');
        expect(hasMessages).toBe(true);

        const hasNoMessages = await repository.has('room2');
        expect(hasNoMessages).toBe(false);
    });

    it('채팅 메시지의 수를 제한할 수 있어야 합니다', async () => {
        const chatMessages: ChatMessage[] = Array.from({ length: 51 }, (_, i) => ({
            clientId: `${i}`,
            message: `Message ${i}`,
            nickname: `nickname${i}`,
        }));
        for (const message of chatMessages) {
            await repository.add('room1', message);
        }

        const messages = await repository.get('room1');
        expect(messages.length).toBe(50);
        expect(messages[0].clientId).toBe('1');
    });
});
