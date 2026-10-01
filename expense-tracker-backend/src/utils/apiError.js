class apiError extends Error{
    constructor(
        statusCode,
        message= "something went wwrong",
        error=[]
    )
    {
        super(message),
        this.statusCode=statusCode;
        this.message=message;
        this.error=error
        
    }
}
export{apiError}