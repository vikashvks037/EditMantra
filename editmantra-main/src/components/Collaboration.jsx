import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const Collaboration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { challenge } = location.state || {};

  const [code, setCode] = useState(""); // Default code
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  const [isLoading, setIsLoading] = useState(false);
  const [testCases, setTestCases] = useState([]); // Store test case results

  if (!challenge) return <p>No challenge selected</p>;

  // Placeholder code for Python & Java
  const placeholders = {
    python: `# Python Starter Code\n\ndef main():\n    print("Hello, Python!")\n\nif __name__ == "__main__":\n    main()`,
    java: `// Java Starter Code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}`
  };

  // Update code when language changes
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(placeholders[newLang]); // Set default code when switching languages
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setTestCases([]); // Reset test case results
    try {
      const response = await axios.post("https://editmantra-backend.onrender.com/compile", {
        code,
        lang: language,
        questionId: challenge._id,
      });

      if (response.data.status === "success") {
        setOutput("✅ Code passed test cases and stored in DB.");
      } else {
        setOutput("❌ Code failed test cases.");
      }

      setTestCases(response.data.testCaseResults || []);
    } catch (error) {
      setOutput("Error: Unable to execute code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to Review Page
  const handleReviewClick = () => {
    navigate("/Dashboard/AdminRealTimeCollaboration/Review", { state: { code, language } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-300">
      {/* Header at the Top */}
      <Header />

      {/* Review Button for Small Screens */}
      <div className="md:hidden flex justify-center mt-4">
        <button
          onClick={handleReviewClick}
          className="w-full max-w-xs px-4 py-2 text-white font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 
                     rounded-lg shadow-lg transform hover:scale-105 transition-all"
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
          }}
        >
          Paste Code here for Review 🚀
        </button>
      </div>

      {/* Main Content - Flex Grow to fill space */}
      <main className="flex-1 p-5 relative">
        {/* Review Button for Large Screens */}
        <button
          onClick={handleReviewClick}
          className="hidden md:block absolute top-5 right-5 px-4 py-2 text-white font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 
                     rounded-lg shadow-lg transform hover:scale-105 transition-all"
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
          }}
        >
          Paste Code here for Review 🚀
        </button>

        <h3 className="text-2xl font-semibold text-blue-800">{challenge.title}</h3>
        <p className="text-xl text-cyan-600">{challenge.description}</p>

        {/* Language Selection */}
        <div className="mt-4 mb-4 font-bold text-purple-500 ">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="p-2 border rounded cursor-pointer"
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Side-by-Side Layout for Code Editor & Output */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Code Editor Section */}
          <div className="w-full md:w-full">
            <CodeMirror
              value={code}
              height="300px"
              theme={dracula}
              extensions={[language === "python" ? python() : java()]}
              onChange={(value) => setCode(value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-4 p-2 bg-purple-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? "Running..." : "Submit"}
        </button>

        {/* Test Case Results */}
        {testCases.length > 0 && (
          <div className="bg-purple-50 p-4 rounded shadow mt-4">
            <h4 className="font-semibold">Test Case Results:</h4>
            {testCases.map((test, index) => (
              <div key={index} className="mt-2 p-2 border rounded">
                <p><strong>Test Case {index + 1}:</strong> {test.passed ? "✅ Passed" : "❌ Failed"}</p>
                <p><strong>Input:</strong> {test.input}</p>
                <p><strong>Expected Output:</strong> {test.expectedOutput}</p>
                <p><strong>Actual Output:</strong> {test.actualOutput || "No Output"}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer at the Bottom */}
      <Footer />
    </div>
  );
};

export default Collaboration;
