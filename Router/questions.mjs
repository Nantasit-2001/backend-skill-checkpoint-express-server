import { Router } from "express";
import connectionPool from '../utils/db.mjs'

import { checkEmptyBodyQuestion,invalidQueryParameter,checkEmptyBodyAnswers,checkEmptyBodyVote } from "../middleware/questionValidation.js";

const questionsRouter=Router();

/**
 * @swagger
 * /questions/search:
 *   get:
 *     summary: Search for questions
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Title keyword to search
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Category to search
 *     responses:
 *       200:
 *         description: List of matched questions
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request data
 *       500:
 *         description: Unable to fetch a question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to fetch a question
 */

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


/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     description: Create a new question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string     
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question created successfully
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request data
 *       500:
 *         description: Unable to fetch a question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to fetch a question
 */
questionsRouter.post("/",[checkEmptyBodyQuestion], async (req,res)=>{
  const {title, description,category}=req.body
  try{
    const result = await connectionPool.query(
      'INSERT INTO questions (title,description,category) VALUES($1,$2,$3)',[title,description,category])
      return res.status(201).json({"message": "Question created successfully."})
    }catch(e){return res.status(500).json({"message": "Unable to create question."})}
}); 

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     description: Get all questions 
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Unable to fetch questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to fetch a question
 */
questionsRouter.get("/",[],async (req, res) => {
  try{
    const result = await connectionPool.query(
      'select * from questions'
    )
    return res.status(200).json({date:result.rows});
    }catch(e){ return res.status(500).json({"message": "Unable to fetch questions."})}
  });

/**
 * @swagger
 * /questions/{questionId}:
 *   get:
 *     summary: Get a question by ID
 *     description: Fetch a specific question by its ID
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question to fetch
 *     responses:
 *       200:
 *         description: Successfully fetched the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found
 *       500:
 *         description: Unable to fetch a question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to fetch a question
 */
questionsRouter.get("/:questionId",[],async (req, res) => {
    const id = req.params.questionId
    try{
      const result = await connectionPool.query(
        'select * from questions where id=$1 ',[id])
      if(result.rows.length === 0){return res.status(404).json({"message": "Question not found."});} //สงสัย ? ถ้าไปเช็คใน Middleware ก็ต้อง req ไปหา server 2 รอบหรอ?
      return res.status(200).json({date:result.rows[0]});
      }catch(e){ return res.status(500).json({"message": "Unable to fetch questions."})}
    });

    /**
 * @swagger
 * /questions/{questionId}:
 *   put:
 *     summary: Update a question by ID
 *     description: Update the title, description, and category of a question
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question updated successfully.
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request data.
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found.
 *       500:
 *         description: Unable to fetch questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to fetch questions.
 */
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

      /**
 * @swagger
 * /questions/{questionId}:
 *   delete:
 *     summary: Delete a question
 *     description: Delete a specific question by its ID
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question to delete
 *     responses:
 *       200:
 *         description: Question post has been deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question post has been deleted successfully.
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found.
 *       500:
 *         description: Unable to delete question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to delete question.
 */
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

/**
 * @swagger
 * /questions/{questionId}/answers:
 *   get:
 *     summary: Get all answers for a question
 *     description: Retrieve all answers that belong to a specific question
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question to fetch answers for
 *     responses:
 *       200:
 *         description: Successfully retrieved answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question_id:
 *                         type: integer
 *                       content:
 *                         type: string
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found.
 *       500:
 *         description: Unable to fetch answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to fetch answers.
 */
questionsRouter.get("/:questionId/answers",[], async(req,res)=>{
  const id = req.params.questionId
  try{
    const result = await connectionPool.query(
      `Select questions.id as question_id, answers.content from questions
      Left Join answers on questions.id = answers.question_id
      Where questions.id = $1`,[id])
      if(result.rows.length<1) return res.status(404).json({"message": "Question not found."})
    return res.status(200).json({data:result.rows})
  }catch(e){return res.status(500).json({"message": "Unable to fetch answers."})}
})

/**
 * @swagger
 * /questions/{questionId}/answers:
 *   post:
 *     summary: Create an answer for a question
 *     description: Create a new answer associated with a specific question ID.
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: This is the answer content.
 *     responses:
 *       201:
 *         description: Answer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Answer created successfully.
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request data.
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found
 *       500:
 *         description: Unable to create answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to create answers.
 */
questionsRouter.post("/:questionId/answers", [checkEmptyBodyAnswers], async (req, res) => {
  const id = req.params.questionId;
  const { content } = req.body;
  try {
    const result = await connectionPool.query(
      `WITH check_question AS (SELECT id FROM questions WHERE id = $1)
      INSERT INTO answers (content,question_id)
      SELECT  $2,$1
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

/**
 * @swagger
 * /questions/{questionId}/vote:
 *   post:
 *     summary: Vote for a question
 *     description: Add a vote for a specific question by its ID. The vote value must be provided (e.g., 1 or -1).
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vote
 *             properties:
 *               vote:
 *                 type: integer
 *                 description: Vote value (1 for upvote, -1 for downvote)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Vote recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vote on the question has been recorded successfully.
 *       400:
 *         description: Invalid vote value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid vote value.
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found
 *       500:
 *         description: Unable to vote answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to vote answers.
 */
questionsRouter.post("/:questionId/vote",[checkEmptyBodyVote],async(req,res)=>{
  const id = req.params.questionId
  const {vote} = req.body
  try{
  const result = await connectionPool.query(
    `WITH check_question AS (SELECT id FROM questions WHERE id = $1)
      INSERT INTO question_votes (vote,question_id)
      select $2, $1
      FROM check_question
      WHERE EXISTS (SELECT 1 FROM check_question)
      RETURNING id`,[id,vote])
      if (result.rowCount<1) {
        return res.status(404).json({ message: "Question not found." });}
      return res.status(201).json({message:"Vote on the question has been recorded successfully."
      });
      }catch(e){ return res.status(500).json({ message: "Unable to vote answers."})}
    })

    /**
 * @swagger
 * /questions/{questionId}/answers:
 *   delete:
 *     summary: Delete all answers for a question
 *     description: Deletes all answers related to a specific question by its ID.
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question whose answers will be deleted
 *     responses:
 *       200:
 *         description: All answers for the question have been deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All answers for the question have been deleted successfully.
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found
 *       500:
 *         description: Unable to delete answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to delete answers.
 */
questionsRouter.delete("/:questionId/answers",[], async (req,res)=>{
  const id = req.params.questionId
  try{
    
    const checkQuestionId = await connectionPool.query(
      `select * from questions where id=$1`,[id])
      if(checkQuestionId.rowCount<1){
        return res.status(404).json({ message: "Question not found." });
      }
    const result = await connectionPool.query(
    ` DELETE FROM answers where question_id=$1`,[id])
      return res.status(200).json({message: "All answers for the question have been deleted successfully."})
  }catch(e){
    return res.status(500).json({"message": "Unable to delete answers."})
  }
})

export default questionsRouter

