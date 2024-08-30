import express from "express";
import { userSignIn, userSignUp } from "../controller/user.controller.js";
import jwt from "jsonwebtoken"; // Ensure that JWT is imported

const app = express.Router();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Correct header access

  // Check if Authorization header is missing
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
  // Extract the token from the 'Bearer <token>' format
  const token = authHeader.split(' ')[1];

  // If token is missing
  if (!token) return res.status(401).json({ message: 'Access denied, token missing' });

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Store the user info in request
    next(); // Continue to the next middleware

  } catch (error) {
    res.status(400).json(token);
    console.log("error in authentication middleware");
    
  }
};
// Only /userSignUp should require authentication
app.post("/userSignUp", userSignUp);

// /userSignIn does not require authentication since it's for login
app.post("/userSignIn", userSignIn);

export default app;
