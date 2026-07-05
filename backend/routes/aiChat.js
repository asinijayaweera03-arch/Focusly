const express = require("express");
const multer = require("multer");
const router = express.Router();
const model = require("../config/gemini");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/chat", upload.single("image"), async (req, res) => {
  try {
    const { message, history } = req.body;
    const parsedHistory = history ? JSON.parse(history) : [];

    const chat = model.startChat({ history: parsedHistory });

    let messageParts = [message || "Describe this image."];

    if (req.file) {
      messageParts = [
        { text: message || "Describe this image." },
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: req.file.buffer.toString("base64"),
          },
        },
      ];
    }

    const result = await chat.sendMessage(messageParts);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI chat failed" });
  }
});

module.exports = router;