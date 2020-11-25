import * as express from 'express';
import {User} from '../entity/User';
import * as error from '../strings/errorMessages'
import * as bcrypt from 'bcryptjs'
import * as yup from 'yup';
import * as jwt from 'jsonwebtoken'
import {ValidationError} from "yup";
import e = require('express');
const router = express.Router();
const saltRounds = 10;
const privateKey = "Gagseggyr747473fte3t63w2"

router.get('/:id?',async (req:any, res:any) => {
  
    if(req.params.id){
      let user = await User.findOne(req.params.id);
      console.log(user);
      res.send({
        user: user,
        errors: {
        }
    })
    }else{
      let users = await User.find();
      console.log(users);
      res.send({
        user: users,
        errors: {
        }
    })
    }
    
  })
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
router.post('/logIn', async (req:any, res:any) => {
    let user = await User.findOne({email: req.body.email});
    if(!user){
        return res.send({
            user: null,
            errors: error.noEmailFound
        })
    }else{
        let correctPassword = await bcrypt.compare(req.body.password,user.password)
        if(correctPassword){
            let token = await jwt.sign({email: user.email, id: user._id},privateKey);
            return res.send({
                user: user,
                token : token,
                errors: {}
            })
        }else{
            return res.send({
                user: null,
                errors: error.incorrectPassword
            })
        }
    }
 })

  router.post('/', async (req:any, res:any) => { 
    const userValidation = validateUserInput();
    try{
        await userValidation.validate(req.body, {abortEarly:false});
    }catch(error){
        return res.send({
            user: null,
            errors: parseError(error) 
        })
    }
    let user;
    let hashPassword = await bcrypt.hash(req.body.password,saltRounds);
    if(req.userId){
        if(!req.isAuth){
            return res.send({
                user:null,
                error : error.authError
            })
        }
        user = await User.findOne(req.userId);
        if(!user){
            return res.send({
                user: null,
                errors: error.noUserFound
            })
        }
        
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.surrname  = req.body.surrname || user.surrname;
        user.password = hashPassword || user.password;
        
    }else{
        user = await User.findOne({email: req.body.email});
        if(!user){
            user =  new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.surrname  = req.body.surrname;
            user.password = hashPassword;
        }else{
            return res.send({
                user: null,
                errors: error.userExists
            })
        }
    }
    await user.save();
    return res.send({
        user: user,
        errors: {
        }
    });
});


router.delete('/', async (req:any, res: any) =>{
    if(!req.isAuth){
        return res.send({
            user:null,
            error : error.authError
        })
    }
    if(req.userId){
        let user = await User.findOne(req.userId);
        if(!user){
            return  res.send({
                user: null,
                errors: error.noUserFound
            })
        }
        await user.remove();
        res.send(user);
    }else{
        return  res.send({
            user: null,
            errors: error.noIdSent
        });
    }
})

function validateUserInput(){
    let schema = yup.object().shape({
        email: yup.string().min(5,error.emailTooShort).max(255,error.emailTooLong).email(error.emailFormatError),
        name : yup.string().min(2,error.nameTooShort).max(255,error.nameTooLong),
        surrname: yup.string().min(2,error.surnameTooShort).max(255,error.surnameTooLong),
        password : yup.string().min(5,error.passwordTooShort)

    })
    return schema;
}
export {router};