import express from "express";
import { addResponse, viewResponse } from "../controller/surveyResponse.controller.js";

const app = express.Router();

app.post('/addResponse',addResponse);
app.get('/viewResponse/:survey_id/:user_id',viewResponse);
export default app;