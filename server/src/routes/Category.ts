import * as express from 'express';
import {Category} from '../entity/Category'
import {ValidationError} from "yup";
import * as yup from 'yup';
import * as multer from 'multer'
import * as error from '../strings/errorMessages'
import { processUpload } from '../handlers/fileHandler';
import { Subcategory } from '../entity/Subcategory';
import { Like } from 'typeorm';
import { Http2ServerRequest } from 'http2';

interface RestRequest {
    req: express.Request,
    params: any,
    isAuth: Boolean
}


const router = express.Router();
const upload = multer();

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

router.get('/:id?',async (req:any, res:any) => {
  
    if(req.params.id){
      let category = await Category.findOne(req.params.id,{relations: ["subcategories"]});
      console.log(category);
      res.send({
        category: category,
        errors: {
        }
    })
    }else{
      let categories = await Category.find({relations: ["subcategories"]});
      console.log(categories);
      res.send({
        categories: categories,
        errors: {
        }
    })
    }
    
  })

  router.post('/:id?', upload.single('image'), async (req:any, res:any) => { 
    const categoryValidation = validateCategoryInput();
    let category;
    try{
        await categoryValidation.validate(req.body, {abortEarly:false});
    }catch(error){
        return res.send({
            category: null,
            errors: parseError(error) 
        })
    }

    if(!req.isAuth){
        return res.send({
            category:null,
            error : error.authError
        })
    }

    if(req.params.id){
      category = await Category.findOne(req.params.id);
      if(!category){
        return res.send({
            category: null,
            errors: error.noCategoryFound
        })
      }
      let file = await processUpload(req.file,"categories");
      category.name = req.body.name || category.name;
      category.image = file || category.image;

    }else{
        let file = await processUpload(req.file,"categories");
        category = new Category();
        category.name = req.body.name;
        category.image = file; 
    }

    await category.save();
    return res.send({
        category: category,
        errors: {
        }
    });

  })



  router.delete('/:id', async (req:RestRequest, res: express.Response | any) =>{
    if(!req.isAuth){
        return res.send({
            category:null,
            error : error.authError
        })
    }
    if(req.params.id){
        let category = await Category.findOne(req.params.id);
        if(!category){
            return  res.send({
                category: null,
                errors: error.noCategoryFound
            })
        }
        await category.remove();
        return res.send({
            category: category,
            error: {}
        });
    }else{
        return  res.send({
            category: null,
            errors: error.noIdSent
        });
    }
})

  function validateCategoryInput(){
    let schema = yup.object().shape({
        name : yup.string().min(2,error.nameTooShort).max(255,error.nameTooLong),
    })
    return schema;
}
export {router};