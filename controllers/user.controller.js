const Users = require('../models/user.model')
const Complaint = require('../models/complaint.model')
let createContactController = async function(req,res,next){
    try {
    const { fullName, email, subject, message } = req.body;

    const newMessage = await Complaint.create({
      fullName,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}


module.exports = {createContactController}