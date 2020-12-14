import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany} from "typeorm";
import { Category } from "./Category";
import { Product } from "./Product";

@Entity("subcategories")
export class Subcategory extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column("varchar",{length:255})
    name: string;

    @Column("text")
    image: string;

    @ManyToOne (() => Category, category => category.subcategories,{
        onDelete: 'CASCADE',
    })
    category: Category;
 
    @OneToMany(() => Product, product => product.subcategory)
    products: Product[];
}
