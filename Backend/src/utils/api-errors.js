class ApiError extends Error{
    constructor(
        statusCode,
        message = "something went gone wrong",
        errors = [],
        stack = ""   
    ){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.success = false;
        this.errors = errors

        if(stack){
            this.stack= stack
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError}