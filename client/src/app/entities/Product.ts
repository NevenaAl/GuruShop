import { Category } from './Category';
import { Question } from './Question';
import { Subcategory } from './Subcategory';
import { User } from './User';

export class Product{
    _id: String;
    name: String;
    image: String;
    user: User;
    subcategory: Subcategory;
    category: Category;
    questions: Array<Question>;
    

    constructor(_id: String,name: String,image:String,user: User,subcategory: Subcategory,category: Category,questions: Array<Question>= new Array<Question>()){
        this._id = _id;
        this.image = image;
        this.name = name;
        this.user = user;
        this.subcategory = subcategory;
        this.category = category;
        this.questions = questions;
    }
}