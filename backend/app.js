import bodyParser from "body-parser";
import express from "express"
import connection from "./database/db.connection.js";
import UserRouter from "./route/user.route.js"
import CategoryRouter from  "./route/category.route.js";
import SurveyRouter from './route/survey.route.js'
import QuestionsRouter from './route/questions.route.js';
import SurveyResponse from './route/surveyResponse.route.js';
import dotenv from 'dotenv';

import cors from 'cors';
import association from "./model/association.js";
dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user',UserRouter);
app.use('/category',CategoryRouter);
app.use('/survey',SurveyRouter);
app.use('/question',QuestionsRouter);
app.use('/surveyResponse',SurveyResponse);
app.listen(3000, () => {
    console.log("Server is running...");
})