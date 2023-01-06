const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
mongoose.connect(process.env.DB);

const PORT = 3000;
app.listen(PORT, "", () => {
  console.log("Server is running in " + PORT);
});
