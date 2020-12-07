import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import { Product } from "./Product";
import {User} from  './User'

@Entity("questions")
export class Question extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column("text")
    message: string;

    @Column("text")
    author: string;

    @Column("text")
    answers: JSON;

    @ManyToOne (() => Product, product => product.questions,{
        onDelete: 'CASCADE',
    })
    product: Product;

}