export class Review{
    _id: String;
    author: String;
    rate: number;
    comment: String;

    constructor(rate, comment, author){
        this.rate = rate;
        this.comment = comment;
        this.author = author;
    }
}