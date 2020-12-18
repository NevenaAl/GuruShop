import { Category } from "../entity/Category";
import { Product } from "../entity/Product"
import { ResolverMap } from "../handlers/resolver-map";
import * as error from '../strings/errorMessages';
import { processUpload } from '../handlers/fileHandler';
import * as yup from 'yup';
import {parseError} from '../handlers/errorHandler'

const CategoryResolver: ResolverMap = {
    Query: {
        categories: async () => {
            return await Category.find({ relations: ["subcategories", "products"] });
        },
        category: async (_, { _id }) => {
            const category = await Category.findOne(_id, { relations: ["subcategories", "products"] });
            if (!category) {
                return {
                    categoryPayload: null,
                    errors: [error.noCategoryFound]
                }
            }
            return {
                categoryPayload: category,
                errors: null
            }
        }
    },
    Mutation: {
        createCategory: async (_, { data },{req}) => {
            if(!req.req.isAuth){
                return {
                    categoryPayload:null,
                    errors : [error.authError]
                }
            }
            const { name, image } = data;

            const categoryValidation = validateCategoryInput();
            let category;
            try {
                await categoryValidation.validate(data, { abortEarly: false });
            } catch (error) {
                return {
                    categoryPayload: null,
                    errors: parseError(error)
                }
            }
            
            let file = await processUpload(image, "categories");
            category = await Category.findOne({name: name});
            
            if(!category){
                category = new Category();
                category.name = name;
                category.image = file;
            }else{
                return {
                    categoryPayload: null,
                    errors : [error.categoryExistsError]
                }
            }

            await category.save();
            return {
                categoryPayload: category,
                errors: []
            };

        },
        updateCategory: async(_,{data},{req}) =>{
            if(!req.req.isAuth){
                return {
                    categoryPayload:null,
                    errors : [error.authError]
                }
            }
            const { _id, name, image } = data;
            let category;
            category = await Category.findOne(_id,{ relations: ["subcategories", "products"] });
            if (!category) {
                return {
                    categoryPayload: null,
                    errors: [error.noCategoryFound]
                }
            }
            let categoryNameExists = await Category.findOne({name:name})
            if(categoryNameExists && (categoryNameExists._id!= _id)){
                return {
                    categoryPayload: null,
                    errors: [error.categoryExistsError]
                }
            }
            //let file = await processUpload(req.file, "categories");
            category.name = name || category.name;
            category.image = "file" || category.image;
            await category.save();
            return {
                categoryPayload: category,
                errors: []
            };
        },
        deleteCategory : async(_,{_id},{req})=>{
            if(!req.req.isAuth){
                return {
                    subcategoryPayload:null,
                    errors : [error.authError]
                }
            }

            let category = await Category.findOne({ _id: _id});
            if (!category) {
                return {
                    categoryPayload: null,
                    errors: [error.noCategoryFound]
                }
            }
            await category.remove();
            return {
                categoryPayload: category,
                errors: null
            };
        }
    }
}




function validateCategoryInput(){
    let schema = yup.object().shape({
        name : yup.string().min(2,error.nameTooShort).max(255,error.nameTooLong),
    })
    return schema;
}

export { CategoryResolver }