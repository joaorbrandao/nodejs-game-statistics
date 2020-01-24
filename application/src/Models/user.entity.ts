import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User implements LazyClientObserver{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    clientId: string;

    @Column()
    isLazy: boolean;

    @Column()
    validUntil: Date;

    @Column({nullable: true})
    deletedAt: Date;

    handle(){
        
    }
}