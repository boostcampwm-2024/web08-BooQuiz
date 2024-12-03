import { Injectable, Inject } from '@nestjs/common';
import { ChatRepositoryMemory } from './repository/chat.memory.repository';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatService {
    constructor(
        @Inject('ChatRepository')
        private readonly chatRepository: ChatRepositoryMemory,
    ) {}

    async get(id: string) {
        return this.chatRepository.get(id);
    }

    async add(id: string, chatMessage: ChatMessage) {
        return this.chatRepository.add(id, chatMessage);
    }

    async has(id: string) {
        return this.chatRepository.has(id);
    }

    async delete(id: string) {
        return this.chatRepository.delete(id);
    }
}
