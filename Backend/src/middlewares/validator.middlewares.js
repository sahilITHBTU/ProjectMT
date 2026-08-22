import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { validationResult } from "express-validator";

const validate = (req,res,next)=>{
const errors = validationResult(req);
if(errors.isEmpty()){
    return next()
   }
const extractedErrors = []
errors.array().map((err)=>extractedErrors.push(
    {
        [err.path]:err.message
    }
  ));
  throw new ApiError(422,"Recieved data is  not vaild",extractedErrors)
}

export {validate}