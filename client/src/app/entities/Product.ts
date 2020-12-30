import { Category } from './Category';
import { Question } from './Question';
import { Review } from './Review';
import { Subcategory } from './Subcategory';
import { User } from './User';

export class Product{
    _id: String;
    name: String;
    image: String;
    price: number;
    description: String;
    discount: number;
    amount: number;
    averageRate: number;
    addtionalInfo: JSON;
    user: User;
    subcategory: Subcategory;
    category: Category;
    questions: Array<Question>;
    reviews: Array<Review>;
    

    constructor(_id: String,name: String,image:String,user: User,subcategory: Subcategory,category: Category,questions: Array<Question>= new Array<Question>(),price:number, description: String){
        this._id = _id;
        this.image = image;
        this.name = name;
        this.user = user;
        this.subcategory = subcategory;
        this.category = category;
        this.questions = questions;
        this.discount = 0;
        this.price = price;
        this.description = description;
        this.reviews = new Array<Review>();
    }
}