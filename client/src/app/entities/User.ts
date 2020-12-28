import { Product } from './Product';

export class User{
    _id: String;
    role: String;
    name: String;
    surrname: String;
    email: String;
    password: String;
    isMailConfirmed: boolean = false;
    products: Array<Product>;

    constructor(role: String,name: String,surrname:String,email:String,password:String,isMailConfirmed:boolean,products: Array<Product> = new Array<Product>()){
        this.role = role;
        this.name = name;
        this.surrname = surrname;
        this.password = password;
        this.email = email;
        this.products = products;
        this.isMailConfirmed = isMailConfirmed;
    }
}