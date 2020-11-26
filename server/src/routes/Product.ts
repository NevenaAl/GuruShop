import * as express from 'express';
import {Category} from '../entity/Category'
import {ValidationError} from "yup";
import * as yup from 'yup';
import * as multer from 'multer'
import * as error from '../strings/errorMessages'
import { processUpload } from '../handlers/fileHandler';
import { Subcategory } from '../entity/Subcategory';
import { Like } from 'typeorm';
import { Product } from '../entity/Product';
import { User } from '../entity/User';

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
      let product = await Product.findOne(req.params.id,{relations: ["subcategory","category","user"]});
      console.log(product);
      res.send({
        product: product,
        errors: {
        }
    })
    }else{
      let products = await Product.find({relations: ["subcategory","category","user"]});
      console.log(products);
      res.send({
        products: products,
        errors: {
        }
    })
    }
    
  })
  router.delete('/:id', async (req:any, res: any) =>{
    if(!req.isAuth){
        return res.send({
            product:null,
            error : error.authError
        })
    }
    if(req.params.id){
        let product = await Product.findOne(req.params.id);
        if(!product){
            return  res.send({
                product: null,
                errors: error.noProductFound
            })
        }
        await product.remove();
        return res.send({
            product: product,
            error: {}
        });
    }else{
        return  res.send({
            product: null,
            errors: error.noIdSent
        });
    }
})


router.post('/:id?', upload.single('image'), async (req:any, res:any) => { 
    const productValidation = validateProductInput();
    let product;
    let category = await Category.findOne(req.body.categoryId);
    let subcategory = await Subcategory.findOne(req.body.subcategoryId);
    let user = await User.findOne(req.body.userId);

    if(!category || !subcategory || !user){
        return res.send({
            product: null,
            error : error.productRelationsError
        })
    }
    try{
        await productValidation.validate(req.body, {abortEarly:false});
    }catch(error){
        return res.send({
            product: null,
            errors: parseError(error) 
        })
    }

    if(!req.isAuth){
        return res.send({
            product:null,
            error : error.authError
        })
    }

    if(req.params.id){
        product = await Product.findOne(req.params.id);
      if(!product){
        return res.send({
            product: null,
            errors: error.noProductFound
        })
      }
      let file = await processUpload(req.file,"products");
      product.name = req.body.name || product.name;
      product.image = file || product.image;
      product.category = category || product.category;
      product.subcategory = subcategory || product.subcategory;
      product.user = user || product.user;
    }else{
        let file = await processUpload(req.file,"products");
        product = new Product();
        product.name = req.body.name;
        product.image = file;
        product.category = category;
        product.subcategory = subcategory;
        product.user = user;
    }

    await product.save();
    return res.send({
        product: product,
        errors: {
        }
    });

  })
  function validateProductInput(){
    let schema = yup.object().shape({
        name : yup.string().min(2,error.nameTooShort).max(255,error.nameTooLong),
    })
    return schema;
}
  export {router};