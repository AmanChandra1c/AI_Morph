import express from "express";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) =>{
    try{
        const {user} = req.body;
        console.log(user);
        
    }catch (error){
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export default router;