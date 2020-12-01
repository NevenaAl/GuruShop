import { Category } from "../entity/Category";
import { Subcategory } from "../entity/Subcategory";
import {Product} from "../entity/Product"
import { ResolverMap } from "../handlers/resolver-map";
import * as error from '../strings/errorMessages'
import * as yup from 'yup';
import { ValidationError } from "yup";

const SubcategoryResolver: ResolverMap = {
}
export {SubcategoryResolver}