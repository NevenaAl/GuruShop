import _ = require('lodash');
import { UserResolver } from './userResolver';
import { ProductResolver } from './productResolver';
import { CategoryResolver } from './categoryResolver';
import { SubcategoryResolver } from './subcategoryResolver';

const merged = _.merge(
    UserResolver,
    ProductResolver,
    CategoryResolver,
    SubcategoryResolver

);

const resolvers = {
    ...merged
};

export {resolvers};