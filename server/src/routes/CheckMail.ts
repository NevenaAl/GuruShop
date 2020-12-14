import * as express from 'express';
import * as error from '../strings/errorMessages'
import { User } from '../entity/User';
import { redis } from '../handlers/redis';
import * as constants from '../../config/constants';

const router = express.Router();

export const checkMail = async(req:any,res:any)=>{
    const id = await redis.get(req.params.id);
    console.log(id);
    if(id){
        await User.update({_id:id},{isMailConfirmed:true})
    }
    // res.send({
    //     message: "Mail confirmed!"
    // })
    res.redirect(`${constants.config.clientUrl}/logIn/mailConfirmed`);
}
