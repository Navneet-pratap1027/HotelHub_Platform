const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a travel assistant for 'HotelHub'. 
    User is asking: "${message}". 
    Help them find properties, explain the booking process, or give travel tips. 
    Keep it short, helpful, and use emojis. Mention that HotelHub has the best prices.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, reply: text });
  } catch (err) {
    res.status(500).json({ success: false, message: "AI is resting right now!" });
  }
});

module.exports = router;