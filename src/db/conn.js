const mongoose = require("mongoose");
 
mongoose
  .connect("mongodb://0.0.0.0:27017/youtubeRegistration")
  .then(() => console.log("Connection Successfull....."))
  .catch((err) => console.log(err));