import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity("reviews")
export class Review extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column("varchar",{length:255})
    author: String;

    @Column("float")
    rate: number;

    @Column("varchar",{length:255})
    comment: String;

    @ManyToOne (() => Product, product => product.reviews,{
        onDelete: 'CASCADE',
    })
    product: Product;
}