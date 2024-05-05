import { Request, Response } from 'express';
import OpenAI, { ClientOptions } from "openai";
require('dotenv').config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

class AiController {
    
    async chat(req: Request, res: Response) {
        try {
            const messages = req.body.moves;
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: "You are a helpful assistant for chess analysis you will be getting a series of chess moves you have to analyse the last move and explain it with brief description. you can suggest a better move if user last move is a blunder or mistake. you must not ask any questions. and you must give accurate result you can analyse the who game if you want as you are getting the complete moves for every move." },...messages],
                model: "gpt-3.5-turbo",
            });
            
            console.log(completion.choices[0]);
            res.status(200).send({success: true, message: completion.choices[0].message.content});
        }catch (err) {
            console.error('Error during login:', err);
            res.status(500).send({ success:false, message: 'Internal server error' });
        }
    }
}

export default new AiController();