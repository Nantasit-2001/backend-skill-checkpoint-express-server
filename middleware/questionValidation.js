export const checkEmptyBodyQuestion = (req,res,next)=>{
    const {title, description,category}=req.body
    if(!title || !description ||!category ){
        return res.status(400).json( {"message": "Invalid request data."})
    }
    next();
}

export const checkEmptyBodyAnswers = (req,res,next) =>{
    const {content} = req.body
    if(!content ||content.length>300){
        return res.status(400).json({"message": "Invalid request data."})}
    next();
}

export const checkEmptyBodyVote = (req, res, next) => {
    const { vote } = req.body;
    let invalid = false;
    if (!vote){invalid = true}
    else if (typeof vote !== "number") {invalid = true;} 
    else if (vote !== 1 && vote !== -1) {invalid = true;}
  
    if (invalid) {
      return res.status(400).json({ message: "Invalid vote value" });
    }
    next();
};

export const invalidQueryParameter = (req,res,next)=>{
    if(!req.query.title && !req.query.category)
        return res.status(400).json( {"message": "Invalid request data."})
    next();
}