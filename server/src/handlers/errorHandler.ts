import { ValidationError } from "yup";

const parseError = (err: ValidationError)=>{
    const errors : Array <{path: string,message:string}> = [];
    err.errors.forEach(e => {
        errors.push({
            path: e.path ? e.path: "",
            message: e.message ? e.message : ""
        })
    });
    return errors;
}

export {parseError}