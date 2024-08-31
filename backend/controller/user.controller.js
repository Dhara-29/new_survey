
import { request, response } from "express";
import User from "../model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
console.log("hello");

export const userSignUp = async (req, res) => {
    try {
        let user = await User.findOne({ where: { email_Address: req.body.email_Address } });
        const { user_name, email_Address, password } = req.body;
        if (!user) {
            console.log("inside if block ");

            User.create({ user_name, email_Address, password })
                .then((result => {
                    return res.status(200).json({ data: result.dataValues, message: "User Created....." })
                }))
                .catch((err) => {
                    // console.log(err);
                    return res.status(500).json({ err: "Internal Server Error..." })
                })
        } else {
            console.log("User already exist.");
            return res.status(400).json("User already exist.. sjfhhdg.");
        }
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' }); // Handle errors
        // console.log(error);
        console.log("error occurs in catch block");
    }
};



export const userSignIn = async (req, res) => {
    try {
        const { email_Address, password } = req.body;
        console.log(email_Address, password);

        console.log("shfsjdfv");

        if (!email_Address || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await User.findOne({ where: { email_Address } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password user' });
        }
        const isMatch = User.checkPassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password password' });
        }
        // Generate token
        // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        //     expiresIn: '1h'
        // });

        res.status(200).json({
            user_id: user.user_id,
            user_name: user.user_name,
            email_Address: user.email_Address,
        });
    } catch (error) {
        console.log("error : ",error);
        res.status(500).json({ error: 'Error signing in', details: error.message });
    }
};
