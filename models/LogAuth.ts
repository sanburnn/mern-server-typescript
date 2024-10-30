import { Schema, model, Document, Types } from 'mongoose';

interface ILogAuth extends Document {
    userId: Types.ObjectId;
    action: 'login' | 'logout';
    timestamp?: Date;
}

const LogAuthSchema: Schema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },
    action: { 
        type: String, 
        enum: ['login', 'logout'], 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
});

export default model<ILogAuth>('LogAuth', LogAuthSchema);
