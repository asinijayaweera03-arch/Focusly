const express = require("express");
const router = express.Router();
const model = require("../config/gemini");

router.post("/test", async (req, res) => {
  try {
    const result = await model.generateContent("Say hello in one sentence.");
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI call failed" });
  }
});

module.exports = router;