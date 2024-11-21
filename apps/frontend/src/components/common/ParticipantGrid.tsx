import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';
import Typography from '@/components/common/Typogrpahy';

interface Participant {
    avatarUrl?: string;
    name: string;
}

interface ParticipantGridProps {
    participants: Participant[];
    hostId: number;
}

const ParticipantGrid = ({ participants, hostId }: ParticipantGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {participants.map((participant: any, index: any) => (
                <div key={index + participant.name} className="flex items-center gap-2">
                    <Avatar className="border border-gray-300">
                        <AvatarImage
                            src={participant.avatarUrl || '/BooQuizFavicon.png'}
                            alt={participant.name}
                        />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <Typography text={participant.name} size="base" color="black" />
                        {participant.id == hostId && <Crown className="text-yellow-500" />}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ParticipantGrid;
