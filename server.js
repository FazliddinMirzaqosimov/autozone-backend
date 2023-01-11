const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB)
  .then(() => console.log("connected to DB."))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "", () => {
  console.log("Server is running in " + PORT);
});
