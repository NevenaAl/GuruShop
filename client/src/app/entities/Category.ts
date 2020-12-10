import { Product } from './Product';
import { Subcategory } from './Subcategory';

export class Category{
    _id: String;
    name: String;
    image: String;
    subcategories : Array<Subcategory>;
    products: Array<Product>;

    constructor(_id: String,name: String,image:String, subcategories: Array<Subcategory>= new Array<Subcategory>(),products: Array<Product> = new Array<Product>()){
        this._id = _id;
        this.image = image;
        this.name = name;
        this.subcategories = subcategories;
        this.products = products;
    }
}