import _ = require('lodash');
import { UserResolver } from './userResolver';
import { ProductResolver } from './productResolver';
import { CategoryResolver } from './categoryResolver';
import { SubcategoryResolver } from './subcategoryResolver';
import {QuestionResolver } from './questionResolver';
import { ReviewResolver } from './reviewResolver';
import { InputsResolvers } from './inputsResolver';

const merged = _.merge(
    UserResolver,
    ProductResolver,
    CategoryResolver,
    SubcategoryResolver,
    QuestionResolver,
    ReviewResolver,
    InputsResolvers

);

const resolvers = {
    ...merged
};

export {resolvers};