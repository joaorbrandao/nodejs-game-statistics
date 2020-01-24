import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gameId: number;

    @Column()
    name: string;

    @Column()
    popularity: number;

    @Column()
    updatedAt: Date;
}