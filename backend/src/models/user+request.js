const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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

const RequestSchema = new Schema(
    {
        title: String,
        details: String,
    }
)


const UserSchema = new Schema(
    {
        email: String,
        password: String,
        name: String,
        location: GeoSchema,
        requests: [RequestSchema]
    }
)
  
module.exports.User = mongoose.model('User', UserSchema);
module.exports.Request = mongoose.model('Request', RequestSchema);
