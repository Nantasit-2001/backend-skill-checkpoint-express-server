import { Router } from "express";
import connectionPool from '../utils/db.mjs'

const questionsRouter=Router();

questionsRouter.get("/",[],async (req, res) => {
  try{
    const result = await connectionPool.query(
      'select * from questions'
    )
    return res.status(200).json({date:result.rows});
    }catch(e){ return res.status(500).json({"message": "Unable to fetch questions."})}
  });
  export default questionsRouter
