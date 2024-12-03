import { ChatMessage } from 'src/chat/entities/chat-message.entity';
export class SubmitResponseDto {
    constructor(
        public readonly fastestPlayerIds: string[],
        public readonly submittedCount: number,
        public readonly totalPlayerCount: number,
        public readonly chatMessages: ChatMessage[],
    ) {}
}
