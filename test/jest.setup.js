const buffer = require("buffer");

if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

process.env.CONNECTION_STRING =
  process.env.CONNECTION_STRING || "mongodb://localhost:27017/test_db";
process.env.SECRET =
  process.env.SECRET || "testingsecretkey123456789";
process.env.PORT = process.env.PORT || "3000";
process.env.API_URI = process.env.API_URI || "/api/v";
