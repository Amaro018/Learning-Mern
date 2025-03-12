import express from "express";
import sendEmail from "./../util/sendEmail";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { name, from, message } = req.body;
  console.log("the details", name, from, message);
  try {
    await sendEmail(name, from, message);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
