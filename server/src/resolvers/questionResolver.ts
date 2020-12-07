import { User } from "../entity/User";
import { ResolverMap } from "../handlers/resolver-map";
import * as error from '../strings/errorMessages'
import {parseError} from '../handlers/errorHandler';
import { Question } from "../entity/Question";
import * as yup from 'yup';
import { Product } from "../entity/Product";

class Answer{
    author: String;
    message: String;

}
const QuestionResolver: ResolverMap = {
    Query:{
        questions: async()=>{
            return await Question.find({relations: ["product"]});
        },
        question : async(_,{_id})=>{
            const question = await Question.findOne(_id,{relations: ["product"]});
            if (!question) {
                return {
                    questionPayload: null,
                    errors: [error.noQuestionFound]
                }
            }
            return {
                questionPayload: question,
                errors: null
            }
        }
    },
    Mutation:{
        createQuestion: async(_,{data},{req,pubsub})=>{
            
            const {message, product_id} = data;
            const questionValidation = validateQuestionInput();
            let question;
            try {
                await questionValidation.validate(data, { abortEarly: false });
            } catch (error) {
                return {
                    questionPayload: null,
                    errors: parseError(error)
                }
            }
            
                let product = await Product.findOne(product_id,);
                let user = await  User.findOne(req.req.userId);

                 question = new Question();
               
                question.author = req.req.isAuth?  user.name + user.surrname: "Anonymous";
                question.answers = JSON.stringify({});
                question.message = message;
                question.product = product;

            await question.save();

            pubsub.publish('message', {
                message:{
                mutation: 'CREATED',
                data: question
                }
                });

            return {
                questionPayload: question,
                errors: []
            };
        },
        updateQuestion: async(_,{data},{req,pubsub})=>{
            const {_id, answer} = data;

            let question;
            question = await Question.findOne(_id,{ relations: ["product"] });
            if (!question) {
                return {
                    questionPayload: null,
                    errors: [error.noQuestionFound]
                }
            }
            let user = await  User.findOne(req.req.userId);
               
            const answers: Array<Answer>= new Array<Answer>();

            for(var a of JSON.parse(question.answers)){
                
                let newAnswer = new Answer();
                newAnswer.author = a.author;
                newAnswer.message = a.message;
                answers.push(newAnswer);
                
            }

            let newAnswer = new Answer();
            newAnswer.author = req.req.isAuth?  user.name + user.surrname: "Anonymous";
            newAnswer.message = JSON.parse(answer).message;

            answers.push(newAnswer);

            question.answers =  JSON.stringify(answers);

            await question.save();
            return {
                questionPayload: question,
                errors: []
            };
        },
        deleteQuestion: async(_,{data})=>{

        }
    },
    Subscription: {
        message:
        {
            subscribe  (_parent: any,_args:any,{pubsub},_info:any){
                console.log("bla");
              return pubsub.asyncIterator('message');   
            }
        } 
    }
}

function validateQuestionInput(){
    let schema = yup.object().shape({
        message : yup.string().min(2,error.nameTooShort).max(500,error.nameTooLong),
    })
    return schema;
}

export { QuestionResolver }