import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, BeforeUpdate,
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createAt: Date;

    @UpdateDateColumn({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updateAt: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updateAt = new Date(); // SQLite에서 수동으로 갱신
    }
}