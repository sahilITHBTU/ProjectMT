import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { validationResult } from "express-validator";

const validate = (req,res,next)=>{
const errors = validationResult(req);
if(errors.isEmpty()){
    return next()
   }
const extractedErrors = []
errors.array().forEach((err) => {
  extractedErrors.push({
    [err.path]: err.message,
  });
});
  return next(new ApiError(422,"Recieved data is  not vaild",extractedErrors))
}

export {validate}