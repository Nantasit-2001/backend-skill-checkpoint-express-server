import { Router } from "express";
import connectionPool from '../utils/db.mjs'
import { checkEmptyBodyVote } from "../middleware/questionValidation.js";

const answersRouter=Router();

/**
 * @swagger
 * /answers/{answerId}/vote:
 *   post:
 *     summary: Vote for an answer
 *     description: Record a vote (up or down) on a specific answer.
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the answer to vote
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
 *                 description: Vote value (e.g., 1 or -1)
 *                 enum: [1, -1]
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
*                   example: Vote recorded successfully
*       400:
*         description: Invalid vote value
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Invalid vote value
*       404:
*         description: Answer not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Answer not found
*       500:
*         description: Unable to vote answer
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Unable to vote answer
 */
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