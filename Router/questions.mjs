import { Router } from "express";
import connectionPool from '../utils/db.mjs'

import { ValidateCreateQuestion } from "../middleware/questionValidation.js";

const questionsRouter=Router();

questionsRouter.post("/",[ValidateCreateQuestion], async (req,res)=>{
  const {title, description,category}=req.body
  try{
    const result = await connectionPool.query(
      'INSERT INTO questions (title,description,category) VALUES($1,$2,$3)',[title,description,category])
      return res.status(201).json({"message": "Question created successfully."})
    }catch(e){return res.status(500).json({"message": "Unable to create question."})}
}); 

questionsRouter.get("/",[],async (req, res) => {
  try{
    const result = await connectionPool.query(
      'select * from questions'
    )
    return res.status(200).json({date:result.rows});
    }catch(e){ return res.status(500).json({"message": "Unable to fetch questions."})}
  });

questionsRouter.get("/:questionId",[],async (req, res) => {
    const id = req.params.questionId
    try{
      const result = await connectionPool.query(
        'select * from questions where id=$1 ',[id])
      if(result.rows.length === 0){return res.status(404).json({"message": "Question not found."});} //สงสัย ? ถ้าไปเช็คใน Middleware ก็ต้อง req ไปหา server 2 รอบหรอ?
      return res.status(200).json({date:result.rows[0]});
      }catch(e){ return res.status(500).json({"message": "Unable to fetch questions."})}
    });



export default questionsRouter

