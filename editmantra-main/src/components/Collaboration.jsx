import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript"; // Import JavaScript language mode
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
    javascript: `console.log("Hello, World!");`, // Default code for JavaScript
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(defaultCode[selectedLanguage]);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setOutput("Code is required!");
      return;
    }

    setIsLoading(true);
    try {
        const backendURL = process.env.NODE_ENV === "production"
          ? "https://your-production-url.com/compile"
          : "https://editmantra-backend.onrender.com/compile";
        
        const response = await axios.post(backendURL, {
            code,
            lang: language,
        });

        const { stdout, stderr, compile_output, status } = response.data;

        if (stderr) {
            setOutput(`Error: ${stderr}`);
        } else if (status === 'completed') {
            setOutput(stdout || "No output generated. Please check the code.");
        } else if (compile_output) {
            setOutput(compile_output);  // Error during compilation
        } else {
            setOutput("Unexpected response status.");
        }
    } catch (error) {
        setOutput(`Error: ${error.response?.data || 'Unable to execute code'}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleClean = () => {
    setCode(defaultCode[language]);
    setOutput('');
  };

  const { challenge } = location.state || {};
  if (!challenge) {
    return <p>No challenge selected</p>;
  }

  const languageMode = {
    python: python(),
    javascript: javascript(), // Set language mode for JavaScript
  };

  return (
    <div className="bg-gray-400 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6 p-2">
        <div className="w-full sm:w-1/2 md:w-1/3 p-4 bg-gray-300 rounded-lg shadow-lg">
          <h3 className="text-xl underline mb-4 text-black text-center">{challenge.difficulty}</h3>
          <p className="text-xl font-semibold text-gray-800 mb-2 text-center">{challenge.title}</p>
          <p className="text-gray-700 mb-3 text-center">{challenge.description}</p>
        </div>

        <div className="w-full sm:w-1/2 md:w-2/3 relative">
          <div className="flex flex-col items-start">
            <div className="flex flex-row items-center mb-2">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-4 py-2 mr-4 bg-slate-400 border border-gray-300 rounded-md"
                aria-label="Select Programming Language"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option> {/* Removed Java option */}
              </select>

              <div className="absolute top-0 right-0 flex space-x-4 mr-4">
                <button
                  onClick={handleSubmit}
                  className={`px-6 py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded hover:bg-blue-600`}
                  disabled={isLoading}
                  aria-label="Submit Code"
                >
                  {isLoading ? 'Running...' : 'Submit'}
                </button>
                <button
                  onClick={handleClean}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  aria-label="Clean Code"
                >
                  Clean
                </button>
              </div>
            </div>

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

            <div className="w-full">
              <textarea
                placeholder="Output :-"
                value={output}
                readOnly
                rows="10"
                className="w-full bg-gray-600 text-white p-2 border rounded"
                aria-label="Output of the executed code"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
