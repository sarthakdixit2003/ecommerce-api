import { OrderItem } from "src/order-items/entities/order-item.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { status_enum } from "../enums/status.enum";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: status_enum.Pending })
    status: status_enum;
    
    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @Column('decimal', { default: 0 })
    total: number;

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
}