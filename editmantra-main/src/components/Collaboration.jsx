import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java"; // Java support
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Collaboration = () => {
  const location = useLocation();
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
        questionId: challenge._id, // Ensure question ID is passed
      });

      if (response.data.status === "success") {
        setOutput("✅ Code passed test cases and stored in DB.");
      } else {
        setOutput("❌ Code failed test cases.");
      }

      // Update test case results
      setTestCases(response.data.testCaseResults || []);

    } catch (error) {
      setOutput("Error: Unable to execute code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-300">
      <h3 className="text-2xl font-semibold">{challenge.title}</h3>
      <p className="text-xl">{challenge.description}</p>

      {/* Language Selection */}
      <div className="mt-4 mb-4">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 border rounded"
        >
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Code Editor */}
      <CodeMirror
        value={code}
        height="300px"
        theme={dracula}
        extensions={[language === "python" ? python() : java()]} // Switch between Python & Java
        onChange={(value) => setCode(value)}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        disabled={isLoading}
      >
        {isLoading ? "Running..." : "Submit"}
      </button>

      {/* Output Area */}
      <textarea
        value={output}
        readOnly
        className="w-full mt-4 p-2 bg-gray-100 border rounded"
      />

      {/* Test Case Results */}
      {testCases.length > 0 && (
        <div className="bg-white p-4 rounded shadow mt-4">
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
    </div>
  );
};

export default Collaboration;
