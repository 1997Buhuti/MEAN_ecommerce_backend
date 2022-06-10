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

categorySchema.virtual("id").get(function () {
  return this._id.toString();
});

categorySchema.set("toJSON", {
  virtual: true,
});

exports.Category = mongoose.model("Category", categorySchema);
