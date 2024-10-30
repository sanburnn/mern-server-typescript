import { Schema, model, Document } from 'mongoose';

interface IEmail extends Document {
    email: string;
    date: string;
    description?: string;
}

const EmailSchema: Schema = new Schema({
    email: { 
        type: String, 
        required: true 
    },
    date: { 
        type: String, 
        required: true 
    }, 
    description: { 
        type: String 
    }
});

export default model<IEmail>('Email', EmailSchema);
