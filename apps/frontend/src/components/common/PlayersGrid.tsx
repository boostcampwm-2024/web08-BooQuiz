import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';
import Typography from '@/components/common/Typogrpahy';
import { Player } from '@/types/quizZone.types';

// 개별 플레이어 카드 컴포넌트
interface PlayerCardProps {
    isCurrentPlayer?: boolean;
    player: Player;
    isHost: boolean;
}

const PlayerCard = ({ isCurrentPlayer = false, player, isHost }: PlayerCardProps) => {
    const initials = player.nickname
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            role="listitem"
            aria-label={`Player ${player.nickname}${isHost ? ' (Host)' : ''}`}
        >
            <div className="relative">
                <Avatar className="border-2 border-gray-200 shadow-sm">
                    <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${isHost ? '방장' : player.nickname}`}
                        alt={`${player.nickname}'s avatar`}
                    />
                    <AvatarFallback className="bg-primary-50 text-primary-700">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                {isHost && (
                    <Crown
                        className="absolute -top-3 right-3 text-yellow-400 drop-shadow-md"
                        size={16}
                        aria-label="Host"
                        fill="currentColor"
                    />
                )}
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
                {isCurrentPlayer ? (
                    <Typography text={player.nickname} size="base" color="blue" bold={true} />
                ) : (
                    <Typography text={player.nickname} size="base" color="black" bold={false} />
                )}
            </div>
        </div>
    );
};

interface PlayersGridProps {
    currentPlayer?: Player;
    players: Player[];
    hostId: string;
    className?: string;
}

const PlayersGrid = ({ currentPlayer, players, hostId, className = '' }: PlayersGridProps) => {
    if (!players.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Typography text="아직 참가자가 없습니다" size="lg" color="blue" />
            </div>
        );
    }

    return (
        <div
            role="list"
            aria-label="참가자 목록"
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
        >
            {players.map((player) => (
                <PlayerCard
                    key={`${player.id}-${player.nickname}`}
                    isCurrentPlayer={currentPlayer?.id === player.id}
                    player={player}
                    isHost={player.id === hostId}
                />
            ))}
        </div>
    );
};

export default PlayersGrid;
