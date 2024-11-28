import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';
import Typography from '@/components/common/Typogrpahy';
import { Player } from '@/types/quizZone.types';

// 포디움 위의 개별 플레이어 컴포넌트
interface PodiumPlayerCardProps {
    player: Player;
    rank: number;
    isHost: boolean;
    isCurrentPlayer?: boolean;
}

const PodiumPlayerCard = ({
    player,
    rank,
    isHost,
    isCurrentPlayer = false,
}: PodiumPlayerCardProps) => {
    const initials = player.nickname
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const medalColors: { [key: number]: string } = {
        1: 'bg-yellow-400',
        2: 'bg-gray-300',
        3: 'bg-amber-600',
    };

    return (
        <div
            className="flex flex-col items-center gap-2"
            role="listitem"
            aria-label={`Rank ${rank}: ${player.nickname}`}
        >
            <div className="relative">
                <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 ${medalColors[rank]} rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10`}
                >
                    {rank}
                </div>
                <Avatar className="w-16 h-16 border-4 border-white shadow-lg z-0">
                    <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${isHost ? '방장' : player.nickname}`}
                        alt={`${player.nickname}'s avatar`}
                    />
                    <AvatarFallback className="bg-primary-50 text-primary-700 text-xl">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                {isHost && (
                    <Crown
                        className="absolute -top-2 -right-2 text-yellow-400 drop-shadow-md"
                        size={20}
                        aria-label="Host"
                        fill="currentColor"
                    />
                )}
            </div>
            <div className="text-center mt-2">
                <Typography
                    text={player.nickname}
                    size="base"
                    color={isCurrentPlayer ? 'blue' : 'black'}
                    bold={isCurrentPlayer}
                />
            </div>
        </div>
    );
};

interface PodiumPlayersProps {
    currentPlayer?: Player;
    players: Player[];
    hostId: string;
    className?: string;
}

const PodiumPlayers = ({ currentPlayer, players, hostId, className = '' }: PodiumPlayersProps) => {
    // 상위 3명의 플레이어만 선택
    const topThreePlayers = players.slice(0, 3);

    if (!players.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Typography text="순위 정보가 없습니다" size="lg" color="blue" />
            </div>
        );
    }

    // 참가자가 1명일 때는 바로 1등으로 처리
    if (topThreePlayers.length === 1) {
        return (
            <div
                role="list"
                aria-label="상위 3등 플레이어"
                className={`flex items-end justify-center gap-4 ${className}`}
            >
                <div className="flex flex-col items-center">
                    <PodiumPlayerCard
                        player={topThreePlayers[0]}
                        rank={1}
                        isHost={topThreePlayers[0].id === hostId}
                        isCurrentPlayer={currentPlayer?.id === topThreePlayers[0].id}
                    />
                    <div className="w-24 h-24 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-lg mt-4 shadow-inner" />
                </div>
            </div>
        );
    }

    // 2등, 1등, 3등 순서로 배치하기 위한 재정렬
    const orderedPlayers = [
        topThreePlayers[1], // 2등
        topThreePlayers[0], // 1등
        topThreePlayers[2], // 3등
    ].filter(Boolean); // undefined 제거

    return (
        <div
            role="list"
            aria-label="상위 3등 플레이어"
            className={`flex items-end justify-center gap-4 ${className}`}
        >
            {orderedPlayers.map((player, index) => {
                if (!player) return null;

                // 실제 순위 계산 (2등, 1등, 3등 순서로 표시되므로)
                const rank = index === 0 ? 2 : index === 1 ? 1 : 3;

                // 포디움 높이 설정
                const podiumHeight = rank === 1 ? 'h-24' : rank === 2 ? 'h-16' : 'h-12';

                return (
                    <div key={player.id} className="flex flex-col items-center">
                        <PodiumPlayerCard
                            player={player}
                            rank={rank}
                            isHost={player.id === hostId}
                            isCurrentPlayer={currentPlayer?.id === player.id}
                        />
                        <div
                            className={`w-24 ${podiumHeight} bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-lg mt-4 shadow-inner`}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default PodiumPlayers;
