import { Category } from "../entity/Category";
import { Product } from "../entity/Product"
import { ResolverMap } from "../handlers/resolver-map";
import * as error from '../strings/errorMessages';
import { processUpload } from '../handlers/fileHandler';
import * as yup from 'yup';
import { ValidationError } from "yup";

const CategoryResolver: ResolverMap = {
    Query: {
        categories: async () => {
            const categories = await Category.find({ relations: ["subcategories", "products"] });
            if (categories.length == 0) {
                return null;
            }
            return categories;
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
        createCategory: async (_, { data }) => {
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
            //let file = await processUpload(req.file, "categories");
            category = await Category.findOne({name: name});
            
            if(!category){
                category = new Category();
                category.name = name;
                category.image ="file";
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
        updateCategory: async(_,{data}) =>{
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
            if(categoryNameExists){
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
        deleteCategory : async(_,{_id})=>{
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

const parseError = (err: ValidationError)=>{
    const errors : Array <{path: string,message:string}> = [];
    err.inner.forEach(e => {
        errors.push({
            path: e.path ? e.path: "",
            message: e.message ? e.message : ""
        })
    });
    return errors;
}


function validateCategoryInput(){
    let schema = yup.object().shape({
        name : yup.string().min(2,error.nameTooShort).max(255,error.nameTooLong),
    })
    return schema;
}

export { CategoryResolver }