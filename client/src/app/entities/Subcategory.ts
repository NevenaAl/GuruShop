import { Product } from './Product';

export class Subcategory{
    _id: String;
    name: String;
    image: String;
    products : Array<Product>;
    inputsIdentifier: String;
    inputs: string;

    constructor(_id: String,name: String,image:String, products: Array<Product>= new Array<Product>()){
        this._id = _id;
        this.image = image;
        this.name = name;
        this.products = products;
    }
}