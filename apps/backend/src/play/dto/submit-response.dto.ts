class SubmitResponseDto {
    constructor(
        //{ fastestPlayerIdList, submittedCount, totalPlayersCount },
        public readonly fastestPlayerIdList: string[],
        public readonly submittedCount: number,
        public readonly totalPlayersCount: number,
    ) {}
}
