export class Category{
    _id: String;
    name: String;
    image: String;

    constructor(_id: String,name: String,image:String){
        this._id = _id;
        this.image = image;
        this.name = name;
    }
}