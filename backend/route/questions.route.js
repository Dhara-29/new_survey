import express from "express";
import { addQuestion, checkQuestionExists, getQuestionsByCategoryId, getQuestionsBySurveyId, insertRecords, removeOption, removeQuestion, removeQuestionBySurveyId, updatedOption } from "../controller/questions.controller.js";

const app = express.Router();

app.post('/addQuestion',addQuestion);

app.put('/update-option',updatedOption);
app.delete('/removeOption',removeOption);
app.delete('/removeQuestion',removeQuestion);
app.delete('/removeQuestionBySurveyId',removeQuestionBySurveyId);
app.get('/getQuestionsBySurveyId/:survey_id',getQuestionsBySurveyId);
app.get('/getQuestionsByCategoryId/:categoryId',getQuestionsByCategoryId);
app.post('/checkQuestionExists',checkQuestionExists);
app.post('/insertRecords',insertRecords);
export default app;