const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.LLM_API_KEY
});

exports.generateHint = async ({
  problemStatement,
  expectedOutput,
  userQuery
}) => {
  try {
    const prompt = `
You are a SQL tutor.

Problem:
${problemStatement}

Expected Output:
${JSON.stringify(expectedOutput)}

User Query:
${userQuery}

Give a helpful hint WITHOUT giving the full SQL answer.
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt
    });

    return response.text;

  } catch (error) {
    console.error("Gemini New SDK Error:", error);
    throw new Error("LLM hint generation failed");
  }
};