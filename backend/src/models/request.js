import mongoose from 'mongoose';

export const RequestSchema = new mongoose.Schema(
    {
        title: String,
        details: String,
    }
)
  
export const Request = mongoose.model('Request', RequestSchema);