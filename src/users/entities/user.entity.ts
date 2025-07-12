import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('varchar', {length: 100})
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    passwordHash: string;

    @Column({default: 'user'})
    role: 'admin' | 'user';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}