import mongoose, { Schema } from 'mongoose';
import {RequestSchema} from './request';

mongoose.set('useCreateIndex', true);
const GeoSchema = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates:{
        type: [Number],
        index: "2dsphere"
    }
})


const UserSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
        name: String,
        location: GeoSchema,
        requests: [RequestSchema]
    }
)
  
  const User = mongoose.model('User', UserSchema);
  export default User;