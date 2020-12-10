import { Product } from './Product';

export class Question{
    _id: String;
    message: String;
    author: String;
    answers: JSON;
    product: Product;

    constructor(message:String,author: String,answers:JSON,product:Product){
        this.message = message;
        this.author = author;
        this.answers = answers;
        this.product  = product;
    }
}