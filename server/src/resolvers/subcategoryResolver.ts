import { Category } from "../entity/Category";
import { Subcategory } from "../entity/Subcategory";
import {Product} from "../entity/Product"
import { ResolverMap } from "../handlers/resolver-map";
import * as error from '../strings/errorMessages'
import * as yup from 'yup';
import { ValidationError } from "yup";
import {parseError} from "../handlers/errorHandler"
import { processUpload } from "../handlers/fileHandler";

const SubcategoryResolver: ResolverMap = {
    Query: {
        subcategories: async () => {
            return await Subcategory.find({ relations: ["category", "products"] });
        },
        subcategory: async (_, { _id }) => {
            const subcategory = await Subcategory.findOne(_id, { relations: ["category", "products"] });
            if (!subcategory) {
                return {
                    subcategoryPayload: null,
                    errors: [error.noSubcategoryFound]
                }
            }
            return {
                subcategoryPayload: subcategory,
                errors: null
            }
        }
    },
    Mutation: {
        createSubcategory: async (_, { data },{req}) => {
            if(!req.req.isAuth){
                return {
                    productPayload:null,
                    errors : [error.authError]
                }
            }

            const { name, image, category_id } = data;

            const subcategoryValidation = validateSubcategoryInput();
            let subcategory;

            try {
                await subcategoryValidation.validate(data, { abortEarly: false });
            } catch (error) {
                return {
                    subcategoryPayload: null,
                    errors: parseError(error)
                }
            }
            let file = await processUpload(image, "subcategories");
            subcategory = await Subcategory.findOne({name: name});
            
            if(!subcategory){
                let category = await Category.findOne(category_id);
                subcategory = new Subcategory();
                subcategory.name = name;
                subcategory.image = file;
                subcategory.category = category;
            }else{
                return {
                    subcategoryPayload: null,
                    errors : [error.subcategoryExistsError]
                }
            }

            await subcategory.save();
            return {
                subcategoryPayload: subcategory,
                errors: null
            };

        },
        updateSubcategory: async(_,{data},{req}) =>{
            if(!req.req.isAuth){
                return {
                    subcategoryPayload:null,
                    errors : [error.authError]
                }
            }

            const { _id, name, image, category_id } = data;
            let subcategory;
            subcategory = await Subcategory.findOne(_id,{ relations: ["category", "products"] });

            if (!subcategory) {
                return {
                    subcategoryPayload: null,
                    errors: [error.noSubcategoryFound]
                }
            }
            let subcategoryNameExists = await Subcategory.findOne({name:name})
            if(subcategoryNameExists && (subcategoryNameExists._id!=_id)){
                return {
                    subcategoryPayload: null,
                    errors: [error.subcategoryExistsError]
                }
            }
            //let file = await processUpload(req.file, "categories");
            let category = await Category.findOne(category_id);
            subcategory.name = name || subcategory.name;
            subcategory.image = "file" || subcategory.image;
            subcategory.category = category;

            await subcategory.save();
            return {
                subcategoryPayload: subcategory,
                errors: null
            };
        },
        deleteSubcategory : async(_,{_id},{req})=>{
            if(!req.req.isAuth){
                return {
                    subcategoryPayload:null,
                    errors : [error.authError]
                }
            }

            let subcategory = await Subcategory.findOne({ _id: _id});
            if (!subcategory) {
                return {
                    subcategoryPayload: null,
                    errors: [error.noSubcategoryFound]
                }
            }
            await subcategory.remove();
            return {
                subcategoryPayload: subcategory,
                errors: null
            };
        }
    }
}


function validateSubcategoryInput(){
    let schema = yup.object().shape({
        name : yup.string().min(2,error.nameTooShort).max(255,error.nameTooLong),
    })
    return schema;
}


export {SubcategoryResolver}