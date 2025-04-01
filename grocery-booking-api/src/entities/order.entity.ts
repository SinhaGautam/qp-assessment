import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./User.entity";

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @ManyToOne(() => Users)
  @JoinColumn({name: "user_id"})
  user_Id: Users | undefined;

  @Column("jsonb")
  items: {
      groceryId: number;
      name: string;
      quantity: number;
      price: number;
      subtotal: number;
  }[] | undefined;

  @Column("decimal", { precision: 10, scale: 2 })
    total!: number;

  @Column({
        type: "enum",
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    })
    status!: string;

  @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

  @UpdateDateColumn({ name: "updated_at" })
    updated_at!: Date;
}