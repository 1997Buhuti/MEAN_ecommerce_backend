const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const userList = await User.find();

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

// Routes for getting user List.
module.exports = router;
