import express from "express";
import { addResponse } from "../controller/surveyResponse.controller.js";

const app = express.Router();

app.post('/addResponse',addResponse);
export default app;