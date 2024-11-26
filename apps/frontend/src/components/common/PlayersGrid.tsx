import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';
import Typography from '@/components/common/Typogrpahy';
import { Player } from '@/types/quizZone.types';

// 개별 플레이어 카드 컴포넌트
interface PlayerCardProps {
    player: Player;
    isHost: boolean;
}

const PlayerCard = ({ player, isHost }: PlayerCardProps) => {
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
            <Avatar className="border-2 border-gray-200 shadow-sm">
                <AvatarImage src={'/BooQuizFavicon.png'} alt={`${player.nickname}'s avatar`} />
                <AvatarFallback className="bg-primary-50 text-primary-700">
                    {initials}
                </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <Typography text={player.nickname} size="base" color="black" />
                {isHost && (
                    <Crown className="text-yellow-500 flex-shrink-0" size={20} aria-label="Host" />
                )}
            </div>
        </div>
    );
};

interface PlayersGridProps {
    players: Player[];
    hostId: string;
    className?: string;
}

const PlayersGrid = ({ players, hostId, className = '' }: PlayersGridProps) => {
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
                    player={player}
                    isHost={player.id === hostId}
                />
            ))}
        </div>
    );
};

export default PlayersGrid;
