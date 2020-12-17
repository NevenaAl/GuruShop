import { User } from "../entity/User";
import {Product} from "../entity/Product"
import { ResolverMap } from "../handlers/resolver-map";
import * as error from '../strings/errorMessages'
import * as yup from 'yup';
import { ValidationError } from "yup";
import { Subcategory } from "../entity/Subcategory";
import { Category } from "../entity/Category";
import {parseError} from "../handlers/errorHandler"
import { processUpload } from "../handlers/fileHandler";

const ProductResolver: ResolverMap = {
    Query:{
        products: async ()=>{
           return await Product.find({ relations: ["user","subcategory", "category"] });  
        },
        product: async(_,{_id})=>{
            const product = await Product.findOne(_id, { relations: ["user","subcategory", "category"] });
            if (!product) {
                return {
                    productPayload: null,
                    errors: [error.noProductFound]
                }
            }
            return {
                productPayload: product,
                errors: null
            }
        }

    },
    Mutation:{
        createProduct : async(_,{data},{req})=>{
            if(!req.req.isAuth){
                return {
                    productPayload:null,
                    errors : [error.authError]
                }
            }

            const {name, image, subcategory_id} = await data;

            await Promise.all(image.map((i:any) => {
                return i.promise;
            }));

            console.log(image);
            const productValidation = validateProductInput();
            let product;
            try {
                await productValidation.validate(data, { abortEarly: false });
            } catch (error) {
                return {
                    productPayload: null,
                    errors: parseError(error)
                }
            }
            
            const images = await Promise.all(image? image.map(element => processUpload(element,"products")): '');
            const urls = (await images).join(',');
            product = await Product.findOne({name: name});
            
            if(!product){
                let subcategory = await Subcategory.findOne(subcategory_id,{relations:["category"]});
                let category = await Category.findOne(subcategory.category._id);
                let user = await  User.findOne(req.req.userId);

                product = new Product();
                product.name = name;
                product.image = urls;
                product.subcategory = subcategory;
                product.category = category;
                product.user = user;
            }else{
                return {
                    productPayload: null,
                    errors : [error.productExistsError]
                }
            }

            await product.save();
            return {
                productPayload: product,
                errors: []
            };

        },
        updateProduct: async(_,{data},{req})=>{
            if(!req.req.isAuth){
                return {
                    productPayload:null,
                    errors : [error.authError]
                }
            }

            const { _id, name, image, subcategory_id } = data;
            let product;
            product = await Product.findOne(_id,{ relations: ["user","category", "subcategory"] });
            if (!product) {
                return {
                    productPayload: null,
                    errors: [error.noProductFound]
                }
            }
            let productNameExists = await Product.findOne({name:name})
            if(productNameExists && (productNameExists._id != _id)){
                return {
                    productPayload: null,
                    errors: [error.productExistsError]
                }
            }
            //let file = await processUpload(req.file, "categories");
            let subcategory = await Subcategory.findOne(subcategory_id);
            let category = await Category.findOne(subcategory.category._id);
            product.name = name || product.name;
            product.image = "file" || product.image;
            product.subcategory = subcategory;
            product.category = category;

            await product.save();
            return {
                productPayload: product,
                errors: []
            };
        },
        deleteProduct : async(_,{_id},{req})=>{
            if(!req.req.isAuth){
                return {
                    productPayload:null,
                    errors : [error.authError]
                }
            }

            let product = await Product.findOne({ _id: _id});
            if (!product) {
                return {
                    productPayload: null,
                    errors: [error.noProductFound]
                }
            }
            await product.remove();
            return {
                productPayload: product,
                errors: null
            };
        }
    }
}


function validateProductInput(){
    let schema = yup.object().shape({
        name : yup.string().min(2,error.nameTooShort).max(255,error.nameTooLong),
    })
    return schema;
}
export {ProductResolver}