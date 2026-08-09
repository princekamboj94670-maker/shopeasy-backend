require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// ===============================
// HOME / HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "ShopEasy Backend Running ✅"
    });
});


// ===============================
// TEST API
// ===============================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "ShopEasy API Working ✅"
    });
});


// ===============================
// ORDER API TEST
// ===============================

app.post("/api/orders", async (req, res) => {

    try {

        const order = req.body;

        if (!order.name ||
            !order.phone ||
            !order.address ||
            !order.city ||
            !order.pincode ||
            !order.payment) {

            return res.status(400).json({
                success: false,
                message: "Please provide all order details"
            });
        }

        console.log("New Order:", order);

        res.status(201).json({
            success: true,
            message: "Order received successfully ✅",
            order: order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `🚀 ShopEasy Backend running on port ${PORT}`
    );

});
