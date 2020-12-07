import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany} from "typeorm";
import { Category } from "./Category";
import { Question } from "./Question";
import { Subcategory } from "./Subcategory";
import {User} from  './User'

@Entity("products")
export class Product extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column("varchar",{length:255})
    name: string;

    @Column("text")
    image: string;

    @ManyToOne (() => User, user => user.products)
    user: User;

    @ManyToOne (() => Category, category => category.products,{
        onDelete: 'CASCADE',
    })
    category: Category;

    @ManyToOne (() => Subcategory, subcategory => subcategory.products,{
        onDelete: 'CASCADE',
    })
    subcategory: Subcategory;

    @OneToMany(() => Question, question => question.product)
    questions: Question[];
}