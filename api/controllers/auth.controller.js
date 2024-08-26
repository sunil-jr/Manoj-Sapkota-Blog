import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;

    if (!username || !email || !password || username === "" || email === "" || password === ""){
        return next(errorHandler(400, "All fields are required"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User ({
        username, 
        email, 
        password:hashedPassword
    });
    
    try{
    await newUser.save();
    res.json("Signup successful");
    } catch (err){
        next(err);
    }
};

export const signin = async (req, res, next) =>{
    const {email, password} = req.body;

    if (!email || !password || email === "" || password === ""){
        return next(errorHandler(400, "All fields are required"));
    }

    try{
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(400, "Invalid Credentials"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400, "Invalid Credentials"));
        }
        const token = jwt.sign(
            {id: validUser._id}, process.env.JWT_SECRET, {expiresIn : '365d'});
            res.status(200).cookie('access_token', token, {httpOnly: true}).json({
                message: "Signin Successful",
                user: {
                    id: validUser._id,
                    username: validUser.username,
                    email: validUser.email,
                }
            });
    }catch(err){
        next(errorHandler(500, "Something went wrong. Please try again later."));
    }
};