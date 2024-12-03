import { PLAYER_STATE } from '../../common/constants';


export interface Host {
    id: string;
    nickname: string;
    state: PLAYER_STATE;
}
