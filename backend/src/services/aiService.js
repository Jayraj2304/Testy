// Gemini example with @google/generative-ai
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateTestCases(fileContent, fileName) {
  const prompt = `
    Given the following code from ${fileName}, write well-structured and useful unit test cases with brief explanations. Use JavaScript/TypeScript for tests.
    Code:
    ${fileContent}
  `;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}async function generateTestCaseCode(fileContent, summary) {  const prompt = `    Given the following code:
    ${fileContent}
    And the following test case summary:
    ${summary}
    Write the full test case code in JavaScript/TypeScript.  `;  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });  const result = await model.generateContent(prompt);  return result.response.text();}

async function chat(history, message) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  const chatSession = model.startChat({ history });
  const result = await chatSession.sendMessage(message);
  return result.response.text();
}

module.exports = { generateTestCases, generateTestCaseCode, chat };
