import { genSalt, hash } from 'bcrypt';
import { environnement } from './../config';
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        const salt = await genSalt(10);
        this.password = await hash(environnement.API_ADMIN_ACCOUNT, salt);
    }
}
