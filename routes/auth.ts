import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import LogAuth from '../models/LogAuth';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user){
             res.status(400).json({ msg: 'User already exists' });  
        }else{
            user = new User({ username, password });
            await user.save();
    
            res.status(201).json({ msg: 'User registered' });
        } 

    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user){
            res.status(400).json({ msg: 'Invalid credentials' });
        }else{
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch){
                res.status(400).json({ msg: 'Invalid credentials' });
            } 
    
            const payload = { userId: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    
            const log = new LogAuth({ userId: user.id, action: 'login' });
            await log.save();
    
            res.json({ token });
        } 

    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/logout', async (req: Request, res: Response) => {
    try {
        const token = req.header('x-auth-token');
        if (!token){
             res.status(400).json({ msg: 'No token, authorization denied' });
        }else{
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
            const log = new LogAuth({ userId: decoded.userId, action: 'logout' });
            await log.save();
    
            res.json({ msg: 'Logged out successfully' });
        } 

    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default router;
