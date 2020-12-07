import _ = require('lodash');
import { UserResolver } from './userResolver';
import { ProductResolver } from './productResolver';
import { CategoryResolver } from './categoryResolver';
import { SubcategoryResolver } from './subcategoryResolver';
import {QuestionResolver } from './questionResolver';

const merged = _.merge(
    UserResolver,
    ProductResolver,
    CategoryResolver,
    SubcategoryResolver,
    QuestionResolver

);

const resolvers = {
    ...merged
};

export {resolvers};