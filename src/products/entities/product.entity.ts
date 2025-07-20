import { Category } from "src/categories/entities/category.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('int')
    price: number;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToOne(() => Inventory, (inventory) => inventory.product, { cascade: true })
    inventory: Inventory;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}