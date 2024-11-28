class CheckExistingQuizZoneDto {
    constructor(
        public readonly isDuplicateConnection: boolean,
        public readonly newQuizZoneId: string,
        public readonly existingQuizZoneId?: string,
    ) {}
}
