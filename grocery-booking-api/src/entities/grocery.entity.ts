import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Groceries {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
    name!: string;

  @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

  @Column()
    inventory!: number;

  @Column({ nullable: true })
    category!: string;

  @Column({ nullable: true })
    description!: string;

  @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

  @UpdateDateColumn({ name: "updated_at" })
    updated_at!: Date;
}