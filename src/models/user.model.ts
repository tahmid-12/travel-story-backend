import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdOn:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);
export default User;