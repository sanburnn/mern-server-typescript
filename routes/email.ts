import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import Email from '../models/Email';

const router = express.Router();

router.post('/emails', async (req: Request, res: Response) => {
    const { email, date, description } = req.body;

    try {
        const newEmail = new Email({ email, date, description });
        await newEmail.save();

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "b62ea467b36275", 
                pass: "3729694a9c6ec3"  
            }
        });

        const mailOptions = {
            from: 'dimas@gmail.com',
            to: email, 
            subject: 'Hi Salam kenal',
            text: `You have created a new event on ${date}. Description: ${description}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ msg: 'Email sending failed', error: error.message });
            } else {
                console.log('Email sent:', info.response);
                return res.status(200).json({ msg: 'Email sent and saved successfully' });
            }
        });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ msg: 'Server error', error: (err as Error).message });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { email, date, description } = req.body;
    try {
        const newEmail = new Email({ email, date, description });
        await newEmail.save();
        res.status(201).json(newEmail);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const emails = await Email.find();
        res.json(emails);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const { email, date, description } = req.body;
    try {
        const updatedEmail = await Email.findByIdAndUpdate(req.params.id, { email, date, description }, { new: true });
        res.json(updatedEmail);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await Email.findByIdAndDelete(req.params.id);
        res.json({ message: 'Email deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

export default router;
