import * as express from 'express';
import {Subcategory} from '../entity/Subcategory'
import {ValidationError} from "yup";
import * as yup from 'yup';
import * as multer from 'multer'
import * as error from '../strings/errorMessages'
import { processUpload } from '../handlers/fileHandler';
import { Category } from '../entity/Category';


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
      let subcategory = await Subcategory.findOne(req.params.id,{relations:["category"]});
      res.send({
        subcategory: subcategory,
        errors: {
        }
    })
    }else{
      let subcategories = await Subcategory.find({relations:["category"]});
      res.send({
        subcategories: subcategories,
        errors: {
        }
    })
    }
    
  })

  router.post('/:id?', upload.single('image'), async (req:any, res:any) => { 
    const subcategoryValidation = validateSubcategoryInput();
    let subcategory;
    let category = await Category.findOne(req.body.categoryId);
    
    try{
        await subcategoryValidation.validate(req.body, {abortEarly:false});
    }catch(error){
        return res.send({
            subcategory: null,
            errors: parseError(error) 
        })
    }

    if(!req.isAuth){
        return res.send({
            subcategory:null,
            error : error.authError
        })
    }

    if(req.params.id){
        subcategory = await Subcategory.findOne(req.params.id);
      if(!subcategory){
        return res.send({
            subcategory: null,
            errors: error.noCategoryFound
        })
      }
      let file = await processUpload(req.file,"subcategories");
      subcategory.name = req.body.name || subcategory.name;
      subcategory.image = file || subcategory.image;
      subcategory.category = category || subcategory.category;
    }else{
        let file = await processUpload(req.file,"subcategories");
        subcategory = new Subcategory();
        subcategory.name = req.body.name;
        subcategory.image = file;
        subcategory.category = category;
    }

    await subcategory.save();
    return res.send({
        subcategory: subcategory,
        errors: {
        }
    });

  })

  router.delete('/:id', async (req:any, res: any) =>{
    if(!req.isAuth){
        return res.send({
            subcategory:null,
            error : error.authError
        })
    }
    if(req.params.id){
        let subcategory = await Subcategory.findOne(req.params.id);
        if(!subcategory){
            return  res.send({
                subcategory: null,
                errors: error.noCategoryFound
            })
        }
        await subcategory.remove();
        return res.send({
            subcategory: subcategory,
            error: {}
        });
    }else{
        return  res.send({
            subcategory: null,
            errors: error.noIdSent
        });
    }
})

  function validateSubcategoryInput(){
    let schema = yup.object().shape({
        name : yup.string().min(2,error.nameTooShort).max(255,error.nameTooLong),
    })
    return schema;
}
export {router};