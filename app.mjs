import express from "express";
import questionsRouter from "./Router/questions.mjs";
import answersRouter from "./Router/answers.mjs";
const app = express();
const port = 4000;
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation", 
      version: "1.0.0",            
      description: "API docs for Q&A app", 
    },
    servers: [
      {
        url: "http://localhost:4000",     
        description: "Local development", 
      },
    ],
  },
  apis: ["./Router/*.mjs"], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use("/questions",questionsRouter);
app.use("/answers",answersRouter)

app.get("/test",[], (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
