import { Inject, Injectable } from '@nestjs/common';
import { ChatMessage } from '../entities/chat-message.entity';

@Injectable()
export class ChatRepositoryMemory {
    private readonly maxMessageLength: number;

    constructor(
        @Inject('ChatStorage')
        private readonly data: Map<string, ChatMessage[]>,
    ) {
        this.maxMessageLength = 50;
    }

    async get(id: string) {
        return this.data.get(id) ?? null;
    }

    async add(id: string, chatMessage: ChatMessage) {
        const messages = this.data.get(id) ?? [];
        if (messages.length > this.maxMessageLength) {
            messages.shift();
        }
        messages.push(chatMessage);
        this.data.set(id, messages);
    }

    async has(id: string) {
        return this.data.has(id);
    }

    async delete(id: string) {
        this.data.delete(id);
    }
}
