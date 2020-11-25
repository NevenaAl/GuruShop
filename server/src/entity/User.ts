import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany} from "typeorm";
import { Product } from "./Product";

@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column("varchar",{length:255})
    email: string;

    @Column("varchar",{length:255})
    name: string;

    @Column("varchar",{length:255})
    surrname: string;

    @Column("text")
    password: string;
    
    @OneToMany(() => Product, product => product.user)
    products: Product[];
}
