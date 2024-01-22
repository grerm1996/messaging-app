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

const getAllMessages = async (req, res) => {
  console.log("getting all user messages");
  try {
    const allUserMessages = await Messages.find({
      $or: [{ sender: req.user.username }, { recipient: req.user.username }],
    }).sort({
      date: -1,
    });
    return res.status(200).json(allUserMessages);
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
      read: false,
    });
    console.log("here is your message draft:", newMessage);
    await newMessage.save();
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const markAsRead = async (req, res) => {
  console.log(req.params);
  try {
    const filter = { convoId: req.params.convoId };
    const update = { $set: { read: true } };
    const newlyReadMessages = await Messages.updateMany(filter, update);

    if (!newlyReadMessages) {
      return res.status(404).json({ message: "No messages to mark as read" });
    } else {
      console.log("Updated messages:", newlyReadMessages);
      res.json({
        message: "User contacts updated successfully",
        user: newlyReadMessages,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  checkAuthenticated,
  getMessages,
  getAllMessages,
  postMessage,
  markAsRead,
};
