import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import { Category } from "./Category";
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

    @ManyToOne (() => Category, category => category.products)
    category: Category;

    @ManyToOne (() => Subcategory, subcategory => subcategory.products)
    subcategory: Subcategory;
}