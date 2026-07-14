const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend Connected Successfully"
    });
});

app.listen(5000 , ()=>{
      console.log("server is running");
});
