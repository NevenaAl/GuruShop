import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany} from "typeorm";
import { Product } from "./Product";
import { Subcategory } from "./Subcategory";

@Entity("categories")
export class Category extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column("varchar",{length:255})
    name: string;

    @Column("text")
    image: string;

    @Column("varchar",{length:255, nullable: true, unique: true})
    inputsIdentifier: string;

    @Column("text")
    inputs: JSON;

    @OneToMany(() => Subcategory, subcategory => subcategory.category)
    subcategories: Subcategory[];

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}