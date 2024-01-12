const { Messages, Convos, Users } = require("../models");

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
}

const getMessages = async (req, res) => {
  try {
    const messages = await Messages.find({ convoId: req.params.convoId }).sort({
      date: -1,
    });
    const convoObj = await Convos.findOne({ convoId: req.params.convoId });
    const friend = await Users.findOne({
      username: convoObj.participants.filter(
        (user) => user != req.user.username
      ),
    });
    const friendAva = friend.avatar;
    console.log("convoObj:", convoObj);
    return res.status(200).json({ messages, convoObj, friendAva });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const postMessage = async (req, res) => {
  try {
    console.log("req.user is:", req.user);
    const newMessage = await new Messages({
      msgtext: req.body.msgtext,
      sender: req.user.username,
      recipient: req.body.recipient,
      date: new Date(),
      convoId: req.body.convoId,
    });
    console.log("here is your message draft:", newMessage);
    await newMessage.save();
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = { checkAuthenticated, getMessages, postMessage };
