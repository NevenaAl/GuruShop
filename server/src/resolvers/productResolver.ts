import { User } from "../entity/User";
import {Product} from "../entity/Product"
import { ResolverMap } from "../handlers/resolver-map";
import * as error from '../strings/errorMessages'
import * as yup from 'yup';
import { ValidationError } from "yup";
import { Subcategory } from "../entity/Subcategory";
import { Category } from "../entity/Category";
import {parseError} from "../handlers/errorHandler"
import { processDelete, processUpload } from "../handlers/fileHandler";
import { add } from "lodash";

const ProductResolver: ResolverMap = {
    Query:{
        products: async ()=>{
           return await Product.find({ relations: ["user","subcategory", "category"] });  
        },
        product: async(_,{_id})=>{
            const product = await Product.findOne(_id, { relations: ["user","subcategory", "category","reviews","questions"] });
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

            const {name, image, subcategory_id, price, description, discount, amount, additionalInfo} = await data;

            await Promise.all(image.map((i:any) => {
                return i.promise;
            }));

            const productValidation = validateProductInput(data);
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
                product.price = price;
                product.discount= discount || 0;
                product.description = description;
                product.amount = amount;
                product.additionalInfo = additionalInfo || "";
                
            }else{
                return {
                    productPayload: null,
                    errors : [error.productExistsError]
                }
            }

            await product.save();
            return {
                productPayload: product,
                errors: null
            };

        },
        updateProduct: async(_,{data},{req})=>{
            if(!req.req.isAuth){
                return {
                    productPayload:null,
                    errors : [error.authError]
                }
            }

            const { _id, name, newImages, deletedImages, subcategory_id, price, description, discount, amount, additionalInfo } = data;
            if(newImages!=null){
                await Promise.all(newImages.map((i:any) => {
                    return i.promise;
                }));
            }

            let product;
            product = await Product.findOne(_id,{ relations: ["user","category", "subcategory","reviews","questions"] });
            if (!product) {
                return {
                    productPayload: null,
                    errors: [error.noProductFound]
                }
            }
            let productNameExists = await Product.findOne({name:name})
            if(productNameExists){
                return {
                    productPayload: null,
                    errors: [error.productExistsError]
                }
            }
            
            if(deletedImages){
                product.image += ',';
            
                const deletedImagesArray = deletedImages.split(',').filter(x=> !!x);
                deletedImagesArray.forEach(async element => {
                    await processDelete(element);
                });
                deletedImagesArray.forEach(image => {
                    product.image = product.image.replace(image+',',"");
                });
                
            }
           
            const images = await Promise.all(newImages? newImages.map(element => processUpload(element,"products")): '');
            const urls = newImages? (await images).join(',') + ',' + product.image : null;

            
            let subcategory = await Subcategory.findOne({_id:subcategory_id},{relations:["category"]});
            let category = subcategory? await Category.findOne({_id:subcategory.category._id}): null;
               
            product.name = name || product.name;
            product.image = urls || product.image;
            product.subcategory = subcategory || product.subcategory;
            product.category = category || product.category;
            product.price = price || product.price;
            product.description = description || product.description;
            product.discount = discount===null?  product.discount : discount;
            product.amount = amount || product.amount;
            product.additionalInfo = additionalInfo || product.additionalInfo;
           
            await product.save();
            return {
                productPayload: product,
                errors: null
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
            let imagesArray = product.image.split(',').filter(x=> !!x);
            imagesArray.forEach(async element => {
                await processDelete(element);
            });
            await product.remove();
            return {
                productPayload: product,
                errors: null
            };
        }
    }
}


function validateProductInput(data){
    let sch_obj :any ={
        name : yup.string().min(2,error.nameTooShort).max(255,error.nameTooLong),
    }
    for(let i in sch_obj){
        if(!data[i])
            delete sch_obj[i];
    }   

    let schema = yup.object().shape(sch_obj);

    return schema;
}
export {ProductResolver}