const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  icon: {
    type: "string",
  },
  color: {
    type: "string",
  },
});

exports.Category = mongoose.model("Category", categorySchema);
