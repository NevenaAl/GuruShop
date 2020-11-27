import * as express from 'express';
import {router as users} from './User';
import {router as category} from './Category';
import {router as subcategory} from './Subcategory';
import {router as product} from './Product';

function appUse(app:any){
    app.use('/users',users);
    app.use('/categories',category);
    app.use('/subcategories',subcategory);
    app.use('/products',product);
}

export default appUse;