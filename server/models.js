const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  msgtext: { type: String, required: true },
  user: { type: String, required: true },
  recipient: { type: String, required: true },
  date: Date,
})


const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  contacts: { type: Array }
});

const ConvoSchema = new Schema({
  participants: { type: Array, required: true },
  convoId: {type: String, required: true}
})

const Users = mongoose.model("users", UserSchema);
const Messages = mongoose.model("messages", MessageSchema);
const Convos = mongoose.model("convos", ConvoSchema);

module.exports = { Users, Messages, Convos }