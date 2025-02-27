const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🔴 Replace with your actual API key (DO NOT EXPOSE IN PUBLIC REPOS)
const API_KEY = "AIzaSyBDZJ-4ne_IwNU36Pd2nb2Z2tkLqKXcWJk"; 

if (!API_KEY) {
    throw new Error("❌ API Key missing! Set your API key in the API_KEY variable.");
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
        AI System Instruction: Senior Code Reviewer (7+ Years of Experience)
        (Full instructions remain unchanged for brevity)
    `
});

// Function to generate content from AI
async function generateContent(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text(); // Await the response
        return responseText;
    } catch (error) {
        console.error("❌ Error generating content:", error);
        return "⚠️ An error occurred while processing your request.";
    }
}

module.exports = generateContent;
