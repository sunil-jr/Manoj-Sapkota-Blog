import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
mongoose.connect(process.env.MONGO).then(() => {
    console.log('MongoDB is connected!') 
}).catch((err => { console.log(err)}))

const app = express();

const muji = (req,res) => {
    res.end( JSON.stringify({
        "message": "Muji!!!"
    }));
}

app.get("/", muji)

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
})