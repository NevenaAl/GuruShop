import { User } from "../entity/User";
import { ResolverMap } from "../handlers/resolver-map";
import * as error from '../strings/errorMessages'
import * as bcrypt from 'bcryptjs'
import * as yup from 'yup';
import * as jwt from 'jsonwebtoken'
import { ValidationError } from "yup";

const saltRounds = 10;
const privateKey = "Gagseggyr747473fte3t63w2"

const UserResolver: ResolverMap = {
    Query: {
        hello: async () => {
            return "Hello wolrd!"
        },
        users: async () => {
            const users = await User.find({relations: ["products"]});
            if (users.length==0) {
                return null;
            }
            return users;
        },
        user: async(_,{_id})=>{
            const user = await User.findOne(_id,{relations: ["products"]});
            if (!user) {
                return {
                    userPayload: null,
                    errors: [error.noUserFound]
                }
            }
            return {
                userPayload: user,
                errors: null
            }
        }
    },
    Mutation: {
        createUser: async (_, { data }) => {
            const { name, surrname, email, password } = data;

            const userValidation = validateUserInput();
            try {
                await userValidation.validate(data, { abortEarly: false });
            } catch (error) { 
                return {
                    userPayload: null,
                    errors: parseError(error)
                    
                }
            }
            let user;
            let hashPassword = await bcrypt.hash(password, saltRounds);

            user = await User.findOne({ email: email });
            if (!user) {
                user = new User();
                user.name = name;
                user.email = email;
                user.surrname = surrname;
                user.password = hashPassword;
            } else {
                return {
                    userPayload: null,
                    errors: [error.userExists]
                }
            }

            await user.save();
            return {
                userPayload: user,
                errors: null
            };

        },

        updateUser : async  (_, { data })=>{
            const { _id, name, surrname, email, password } = data;

            const userValidation = validateUserInput();
            try {
                await userValidation.validate(data, { abortEarly: false });
            } catch (error) { 
                return {
                    userPayload: null,
                    errors: parseError(error)
                    
                }
            }
            let user;
            let hashPassword = await bcrypt.hash(password, saltRounds);

            user = await User.findOne(_id);
            if (!user) {
                return {
                    userPayload: null,
                    errors: [error.noUserFound]
                }
            } else { 
                user.name = name;
                user.email = email;
                user.surrname = surrname;
                user.password = hashPassword;
            }

            await user.save();
            return {
                userPayload: user,
                errors: null
            };
        },

        deleteUser: async (_, {_id}) =>{
            let user = await User.findOne({ _id: _id});
            if (!user) {
                return {
                    userPayload: null,
                    errors: [error.noUserFound]
                }
            }
            await user.remove();
            return {
                userPayload: user,
                errors: null
            };
        },

        logInUser : async(_,{data}) =>{
            const { email, password } = data;

            let user = await User.findOne({email:email});
            if(!user){
                return {
                    userPayload: null,
                    errors: [error.noEmailFound],
                    token : null
                }
            }else{
                let correctPassword = await bcrypt.compare(password,user.password)
                if(correctPassword){
                    let token = await jwt.sign({email: user.email, id: user._id},privateKey);
                    return {
                        userPayload: user,
                        token : token,
                        errors: null
                    }
                }else{
                    return {
                        userPayload: null,
                        errors: [error.incorrectPassword],
                        token: null
                    }
                }
            }
        }
    }
}
const parseError = (err: ValidationError) => {
    const errors: Array<{ path: string, message: string }> = [];
    err.errors.forEach(e => {
        errors.push({
            path: e.path ? e.path : "",
            message: e.message ? e.message: ""
        })
    });
    return errors;
}

function validateUserInput() {
    let schema = yup.object().shape({
        email: yup.string().min(5, error.emailTooShort).max(255, error.emailTooLong).email(error.emailFormatError),
        name: yup.string().min(2, error.nameTooShort).max(255, error.nameTooLong),
        surrname: yup.string().min(2, error.surnameTooShort).max(255, error.surnameTooLong),
        password: yup.string().min(5, error.passwordTooShort)

    })
    return schema;
}

export { UserResolver }