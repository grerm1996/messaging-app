const { Users } = require("../models");

const addContact = async (req, res) => {
    try {
        const newContact = req.body.contact;
        let contactExists = await Users.findOne({ username: req.body.contact })
        if (!contactExists) res.status(404).json({ message: "No user under that name" });
        console.log(req.user);
        if (req.user.contacts.includes(req.body.contact)) {
            console.log('that contact is already on the list');
            return res.status(404).json({ message: "Contact has already been added" });
        }

        if (contactExists) {

            let convoExists = await Convos.findOne({$or: [
                { participants: [req.body.username, newContact] },
                { participants: [newContact, req.body.username] },
            ]})
            
            if (!convoExists) {
                const newConvo = new Convos({
                    participant1: req.body.username,
                    participant2: newContact,
                    convoId: req.body.username + newContact
                  });
                  await newConvo.save();
            }              

            const userId = req.params.userId;
            console.log(req.body);
            const updatedUser = await Users.findByIdAndUpdate(userId, {
                $push: { contacts: newContact }
            }, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            } else {
                console.log("Updated User:", updatedUser);
                res.json({ message: 'User contacts updated successfully', user: updatedUser });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}


module.exports = { addContact }

