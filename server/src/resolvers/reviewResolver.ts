import { Product } from "../entity/Product";
import { Review } from "../entity/Review";
import { User } from "../entity/User";
import { parseError } from "../handlers/errorHandler";
import { ResolverMap } from "../handlers/resolver-map";
import * as error from '../strings/errorMessages';
import * as yup from 'yup';


const ReviewResolver: ResolverMap = {
    Query:{
        reviews: async()=>{
            return await Review.find({ relations: ["product"] });
        }
    },
    Mutation:{
        createReview: async(_,{data},{req})=>{
           
            const {rate, comment, product_id} = await data;

            const reviewValidation = validateReviewInput();
            
            try {
                await reviewValidation.validate(data, { abortEarly: false });
            } catch (error) {
                return {
                    reviewPayload: null,
                    errors: parseError(error)
                }
            }
            
            let product = await Product.findOne(product_id,{relations: ["reviews"]});
            let user = await  User.findOne(req.req.userId);

            let review = new Review();
            review.rate = rate;
            review.comment = comment;
            review.product = product;
            review.author = req.req.isAuth?  user.name + user.surrname: "Anonymous";

            product.reviews.forEach(review => {
                product.averageRate +=review.rate;
            });
           
            product.averageRate /= product.reviews.length;

            await review.save();
            await product.save();
            return {
                reviewPayload: review,
                errors: null
            };
        },
        deleteReview: async(_,{_id},{req})=>{
            if(!req.req.isAuth){
                return {
                    reviewPayload:null,
                    errors : [error.authError]
                }
            }

            let review = await Review.findOne({ _id: _id});
            if (!review) {
                return {
                    reviewPayload: null,
                    errors: [error.noReviewFound]
                }
            }

            await review.remove();
            return {
                reviewPayload: review,
                errors: null
            };
        }
    }
}

function validateReviewInput(){
    let schema  =  yup.object().shape({
        comment : yup.string().min(2,error.commentTooShort).max(255,error.commentTooLong),
    });

    return schema;
}

export {ReviewResolver}