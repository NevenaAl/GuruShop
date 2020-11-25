import "reflect-metadata";
import {createConnection} from "typeorm";
import {config} from '../config/constants';
import {User} from './entity/User';
import isAuth from './handlers/checkAuth'
import * as express from 'express';
import {router as users} from './routes/User'
import {router as category} from './routes/Category'
import {router as subcategory} from './routes/Subcategory'
import {router as product} from './routes/Product'

console.clear()
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(isAuth);
app.use('/users',users);
app.use('/categories',category);
app.use('/subcategories',subcategory);
app.use('/products',product);


createConnection().then(_ => {
  app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
  })
}).catch(error => console.log(error));

