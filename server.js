const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "ShopEasy Backend Running ✅"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`ShopEasy Backend running on port ${PORT}`);
});
