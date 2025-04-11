import { Router } from "express";
import connectionPool from '../utils/db.mjs'
import { checkEmptyBodyVote } from "../middleware/questionValidation.js";

const answersRouter=Router();

answersRouter.post("/:answerId/vote",[checkEmptyBodyVote],async(req,res)=>{
    const id = req.params.answerId
    const {vote} = req.body
    try{
    const result = await connectionPool.query(
      `WITH check_answers AS (SELECT id FROM answers WHERE id = $1)
        INSERT INTO answer_votes (vote,answer_id)
        select $2, $1
        FROM check_answers
        WHERE EXISTS (SELECT 1 FROM check_answers)
        RETURNING id`,[id,vote])
        if (result.rowCount<1) {
          return res.status(404).json({"message": "Answer not found."});}
        return res.status(201).json({message:"Vote on the question has been recorded successfully."
        });
        }catch(e){ return res.status(500).json({"message": "Unable to vote answer."})}
      })

      export default answersRouter