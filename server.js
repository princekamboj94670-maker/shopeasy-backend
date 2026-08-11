require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// ===============================
// RAZORPAY
// ===============================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ===============================
// HOME
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
// CREATE RAZORPAY ORDER
// ===============================

app.post("/api/payment/create-order", async (req, res) => {

    try {

        const { amount } = req.body;

        if (!amount || Number(amount) <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });

        }

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: "shopeasy_" + Date.now()
        };

        const order =
            await razorpay.orders.create(options);

        res.status(201).json({

            success: true,

            orderId: order.id,

            amount: order.amount,

            currency: order.currency

        });

    } catch (error) {

        console.error(
            "Create Order Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Unable to create payment order"

        });

    }

});


// ===============================
// VERIFY RAZORPAY PAYMENT
// ===============================

app.post("/api/payment/verify", (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;


        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment details missing"

            });

        }


        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");


        if (
            generatedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment verification failed"

            });

        }


        console.log(
            "✅ Payment Verified:",
            razorpay_payment_id
        );


        res.json({

            success: true,

            message:
                "Payment verified successfully ✅",

            paymentId:
                razorpay_payment_id

        });


    } catch (error) {

        console.error(
            "Verification Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Payment verification error"

        });

    }

});


// ===============================
// ORDER API
// ===============================

app.post("/api/orders", async (req, res) => {

    try {

        const order = req.body;


        if (
            !order.name ||
            !order.phone ||
            !order.address ||
            !order.city ||
            !order.pincode ||
            !order.payment
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide all order details"

            });

        }


        console.log(
            "New Order:",
            order
        );


        res.status(201).json({

            success: true,

            message:
                "Order received successfully ✅",

            order: order

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Server error"

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
