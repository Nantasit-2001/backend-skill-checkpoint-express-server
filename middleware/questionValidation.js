export const checkEmptyBody = (req,res,next)=>{
    const {title, description,category}=req.body
    if(!title || !description ||!category ){
        return res.status(400).json( {"message": "Invalid request data."})
    }
    next();
}

export const invalidQueryParameter = (req,res,next)=>{
    if(!req.query.title && !req.query.category)
        return res.status(400).json( {"message": "Invalid request data."})
    next();
}