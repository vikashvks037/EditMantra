import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/python/python";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const defaultPythonCode = `# Python Code
print("Hello, world!")`;

const defaultJavaCode = `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`;

const Editor = () => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(defaultPythonCode);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [output, setOutput] = useState('');

  useEffect(() => {
    editorRef.current = Codemirror.fromTextArea(document.getElementById("realtimeEditor"), {
      mode: selectedLanguage === 'python' ? 'python' : 'javascript', // change mode based on selected language
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    editorRef.current.setValue(code);
    editorRef.current.focus();

    editorRef.current.on("change", (instance) => {
      const newCode = instance.getValue();
      setCode(newCode);
    });

    return () => {
      editorRef.current.toTextArea();
    };
  }, [selectedLanguage]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    if (event.target.value === 'python') {
      setCode(defaultPythonCode);
    } else if (event.target.value === 'java') {
      setCode(defaultJavaCode);
    }
  };

  const handleRunCode = async () => {
    try {
      const response = await fetch("http://localhost:5000/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          lang: selectedLanguage,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setOutput(result.output);
      } else {
        setOutput(`Error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
  };

  return (
    <div className="p-2 shadow-lg flex-col">
      {/* Language Dropdown */}
      <select onChange={handleLanguageChange} value={selectedLanguage} className="mb-2 p-2 border bg-gray-100">
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>

      {/* Code Editor */}
      <textarea id="realtimeEditor" className="w-full h-72 text-base font-mono text-white bg-transparent border-2"></textarea>

      {/* Buttons */}
      <div className="flex space-x-6 my-2">
        <button onClick={handleRunCode} className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-700">Run</button>
        <button onClick={handleClear} className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-700">Clear</button>
      </div>

      {/* Output */}
      <div className="mt-4">
        <h3 className="text-lg font-bold">Output:</h3>
        <pre className="bg-gray-900 p-4 text-white">{output}</pre>
      </div>
    </div>
  );
};

export default Editor;
