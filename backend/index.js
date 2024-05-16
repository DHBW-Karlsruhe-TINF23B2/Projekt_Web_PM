const express = require("express");
const app = express();
const cors = require("cors");
const port = 8000;
app.use(cors());

app.get("/api/test", (req, res) => {
   return res.json({ message: "This is from the backend!" });
});

app.listen(port, () => console.log("Server started on port " + port));