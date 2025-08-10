const { generateTestCases, generateTestCaseCode, chat } = require('../services/aiService');

exports.generateTests = async (req, res) => {
  const { files } = req.body; // [{ name, content }]
  if (!files || files.length === 0) return res.status(400).json({ error: "No files provided" });

  try {
    const aiResponses = await Promise.all(
      files.map(file => generateTestCases(file.content, file.name))
    );
    res.json({ summaries: aiResponses });
  } catch (e) {
    console.error("Error generating tests:", e);
    res.status(500).json({ error: e.message, details: e.stack });
  }
};

exports.generateCode = async (req, res) => {
  const { fileContent, summary } = req.body;
  if (!fileContent || !summary) {
    return res.status(400).json({ error: "File content and summary are required" });
  }

  try {
    const code = await generateTestCaseCode(fileContent, summary);
    res.json({ code });
  } catch (e) {
    console.error("Error generating code:", e);
    res.status(500).json({ error: e.message, details: e.stack });
  }
};

exports.chatWithAI = async (req, res) => {
  const { history, message } = req.body;
  if (!history || !message) {
    return res.status(400).json({ error: "Chat history and message are required" });
  }

  try {
    const response = await chat(history, message);
    res.json({ response });
  } catch (e) {
    console.error("Error in chat:", e);
    res.status(500).json({ error: e.message, details: e.stack });
  }
};
