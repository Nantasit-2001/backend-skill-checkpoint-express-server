import { Router } from "express";
import connectionPool from '../utils/db.mjs'

import { checkEmptyBodyQuestion,invalidQueryParameter,checkEmptyBodyAnswers } from "../middleware/questionValidation.js";

const questionsRouter=Router();

questionsRouter.get("/search", [invalidQueryParameter], async (req, res) => {
  const { title, category } = req.query;

  const conditions = [];
  const values = [];

  if (title) {
    values.push(`%${title}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }

  if (category) {
    values.push(`%${category}%`);
    conditions.push(`category ILIKE $${values.length}`);
  }

  const query = `SELECT * FROM questions WHERE ${conditions.join(" AND ")}`;

  try {
    const result = await connectionPool.query(query, values);
    return res.status(200).json({ data: result.rows });
  } catch (e) {
    console.error(e); // <== ใส่ไว้ debug error
    return res.status(500).json({ message: "Unable to fetch a question." });
  }
});


questionsRouter.post("/",[checkEmptyBodyQuestion], async (req,res)=>{
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

questionsRouter.put("/:questionId",[checkEmptyBodyQuestion],async (req, res) => {
    const id = req.params.questionId
    const {title, description,category}=req.body
      try{
        const result = await connectionPool.query(
          ` UPDATE questions
            SET title=$2, description=$3, category=$4
            where id=$1`,[id,title,description,category])
            if(result.rowCount<1){return res.status(404).json({message:"Question not found."})}
        return res.status(200).json({"message": "Question updated successfully."});
        }catch(e){ return res.status(500).json({"message": "Unable to fetch questions."})}
      });

questionsRouter.delete("/:questionId",[],async (req,res)=>{
  const id = req.params.questionId
  try{
  const result = await connectionPool.query(
    'DELETE FROM questions where id=$1',[id] )
    if(result.rowCount<1){return res.status(404).json({"message": "Question not found."})}
    return res.status(200).json({"message": "Question post has been deleted successfully."})
  }catch(e){
    return res.status(500).json({"message": "Unable to delete question."})
  }
})

questionsRouter.get("/:questionId/answers",[], async(req,res)=>{
  const id = req.params.questionId
  try{
    const result = await connectionPool.query(
      `Select questions.id, answers.content from questions
      Left Join answers on questions.id = answers.question_id
      Where questions.id = $1`,[id])
      if(result.rows.length<1) return res.status(404).json({"message": "Question not found."})
    return res.status(200).json({data:result.rows})
  }catch(e){return res.status(500).json({"message": "Unable to fetch answers."})}
})

questionsRouter.post("/:questionId/answers", [checkEmptyBodyAnswers], async (req, res) => {
  const id = req.params.questionId;
  const { content } = req.body;
  try {
    const result = await connectionPool.query(
      `WITH check_question AS (SELECT id FROM questions WHERE id = $1)
      INSERT INTO answers (content)
      SELECT  $2
      FROM check_question
      WHERE EXISTS (SELECT 1 FROM check_question)
      RETURNING id`,
      [id, content]
    );
    if (result.rowCount<1) {
      return res.status(404).json({ message: "Question not found." });
    }
    return res.status(201).json({ message: "Answer created successfully."});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Unable to create answers."});
  }
});

export default questionsRouter

