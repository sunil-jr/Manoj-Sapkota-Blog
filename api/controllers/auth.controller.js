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
    const {emailOrUsername, password} = req.body;

    if (!emailOrUsername || !password || emailOrUsername.trim() === "" || password.trim() === ""){
        return next(errorHandler(400, "All fields are required"));
    }

    try{
        const validUser = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });
;
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
                    createdAt: validUser.createdAt,
                    updatedAt: validUser.updatedAt,
                }
            });
    }catch(err){
        next(errorHandler(500, "Something went wrong. Please try again later."));
    }
};

export const google = async (req, res, next) =>{
    const {email, name, googlePhotoUrl} = req.body;

    try{
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn : '365d'});
            const {password, ...rest} = user._doc; 
            res.status(200).cookie('access_token', token, {
                httpOnly:true, }).json(rest);
            }else{
                const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
                const newUser = new User(
                    {
                        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),email, password: hashedPassword, profilePicture: googlePhotoUrl, 

                    }
                );
                await newUser.save();
                const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn : '365d'});
                const {password, ...rest} = user._doc; 
                res.status(200).cookie('access_token', token, {
                    httpOnly:true, }).json(rest);
            }
        }
    catch(error){
        next(error);
    }

}