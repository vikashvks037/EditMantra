import React, { useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Collaboration = () => {
  const location = useLocation();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState("python");
  const [isLoading, setIsLoading] = useState(false);

  const defaultCode = {
    python: `print("Hello, World!")`,
    javascript: `console.log("Hello, World!");`,
  };

  // Set default code on language change
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(defaultCode[selectedLanguage]);
  };

  // API Call for Code Execution
  const handleSubmit = useCallback(async () => {
    if (!code.trim()) {
      setOutput("Code is required!");
      return;
    }

    setIsLoading(true);
    try {
      const backendURL =
        process.env.NODE_ENV === "production"
          ? "https://your-production-url.com/compile"
          : "https://editmantra-backend.onrender.com/compile";

      const response = await axios.post(backendURL, {
        code,
        lang: language,
      });

      const { stdout, stderr, compile_output, status } = response.data;

      if (compile_output) {
        setOutput(`Compilation Error: ${compile_output}`);
      } else if (stderr) {
        setOutput(`Runtime Error: ${stderr}`);
      } else if (status === 'completed') {
        setOutput(stdout || "No output generated. Please check the code.");
      } else {
        setOutput("Unexpected response status.");
      }
    } catch (error) {
      setOutput(`Error: ${error.response?.data || 'Unable to execute code'}`);
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  // Reset Code & Output
  const handleClean = useCallback(() => {
    setCode(defaultCode[language]);
    setOutput('');
  }, [language]);

  const { challenge } = location.state || {};
  if (!challenge) {
    return <p>No challenge selected</p>;
  }

  const languageMode = {
    python: python(),
    javascript: javascript(),
  };

  return (
    <div className="bg-gray-400 min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Challenge Description */}
        <div className="w-full sm:w-1/2 md:w-1/3 p-4 bg-gray-300 rounded-lg shadow-lg">
          <h3 className="text-xl underline mb-4 text-black text-center">
            {challenge.difficulty}
          </h3>
          <p className="text-xl font-semibold text-gray-800 mb-2 text-center">
            {challenge.title}
          </p>
          <p className="text-gray-700 mb-3 text-center">{challenge.description}</p>
        </div>

        {/* Code Editor */}
        <div className="w-full sm:w-1/2 md:w-2/3 relative">
          <div className="flex flex-col items-start">

            {/* Language Selector & Buttons */}
            <div className="flex flex-row items-center mb-2 w-full justify-between">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-4 py-2 bg-slate-400 border border-gray-300 rounded-md"
                aria-label="Select Programming Language"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>

              <div className="flex space-x-4">
                <button
                  onClick={handleSubmit}
                  className={`px-6 py-2 ${
                    isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                  } text-white rounded`}
                  disabled={isLoading || !code.trim()}
                  aria-label="Submit Code"
                >
                  {isLoading ? "Running..." : "Submit"}
                </button>
                <button
                  onClick={handleClean}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  disabled={!code.trim()}
                  aria-label="Clean Code"
                >
                  Clean
                </button>
              </div>
            </div>

            {/* CodeMirror Editor */}
            <div className="w-full mb-2">
              <CodeMirror
                value={code}
                height="500px"
                theme={dracula}
                extensions={[languageMode[language]]}
                onChange={(value) => setCode(value)}
                editable={!isLoading}
              />
            </div>

            {/* Output Box */}
            <div className="w-full">
              <textarea
                placeholder="Output :-"
                value={output}
                readOnly
                rows="10"
                className="w-full bg-gray-600 text-white p-2 border rounded"
                aria-label="Output of the executed code"
                aria-live="polite"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
