import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ChatRepositoryMemory } from './repository/chat.memory.repository';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatService {
    constructor(
        @Inject('ChatRepository')
        private readonly chatRepository: ChatRepositoryMemory,
    ) {}

    async set(id: string) {
        this.chatRepository.set(id);
    }

    async get(id: string) {
        if (!this.chatRepository.has(id)) {
            throw new NotFoundException('퀴즈 존에 대한 채팅이 존재하지 않습니다.');
        }
        return this.chatRepository.get(id);
    }

    async add(id: string, chatMessage: ChatMessage) {
        if (!this.chatRepository.has(id)) {
            throw new NotFoundException('퀴즈 존에 대한 채팅이 존재하지 않습니다.');
        }
        return this.chatRepository.add(id, chatMessage);
    }

    async has(id: string) {
        return await this.chatRepository.has(id);
    }

    async delete(id: string) {
        return this.chatRepository.delete(id);
    }
}
