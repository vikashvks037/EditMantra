import { initSocket } from '../socket';
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

const defaultHTMLCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Editor</title>
</head>
<body>
  <h2>Live Code Editor</h2>
  <button onclick="changeText()">Click Me</button>
  <p id="text">This is some text.</p>
  <script>
    function changeText() {
      document.getElementById('text').innerHTML = "Text changed!";
    }
  </script>
</body>
</html>`;

const defaultPythonCode = `print("Hello from Python!")`;

const Editor = () => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("html");
  const [code, setCode] = useState(defaultHTMLCode);
  const [pythonOutput, setPythonOutput] = useState("");

  useEffect(() => {
    const socket = initSocket();

    editorRef.current = Codemirror.fromTextArea(document.getElementById("realtimeEditor"), {
      mode: language === "python" ? "python" : "htmlmixed",
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    editorRef.current.setValue(code);
    editorRef.current.on("change", (instance) => {
      const newCode = instance.getValue();
      setCode(newCode);
      localStorage.setItem("sharedCode", newCode);
      socket.emit("codeChange", newCode);
    });

    const storageListener = (event) => {
      if (event.key === "sharedCode") {
        const newCode = event.newValue;
        if (newCode && newCode !== editorRef.current.getValue()) {
          editorRef.current.setValue(newCode);
          setCode(newCode);
        }
      }
    };

    socket.on("codeChange", (updatedCode) => {
      if (updatedCode !== editorRef.current.getValue()) {
        editorRef.current.setValue(updatedCode);
        setCode(updatedCode);
      }
    });

    window.addEventListener("storage", storageListener);

    return () => {
      window.removeEventListener("storage", storageListener);
      socket.disconnect();
      editorRef.current?.toTextArea();
    };
  }, [language]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    const initialCode = lang === "python" ? defaultPythonCode : defaultHTMLCode;
    setCode(initialCode);
    editorRef.current.setOption("mode", lang === "python" ? "python" : "htmlmixed");
    editorRef.current.setValue(initialCode);
  };

  const handleRunCode = async () => {
    if (language === "python") {
      try {
        const response = await fetch("https://editmantra-backend.onrender.com/compile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ language: "python", code })
        });
        const data = await response.json();
        setPythonOutput(data.output || data.error || "No output.");
      } catch (error) {
        setPythonOutput("Error connecting to backend.");
      }
    } else {
      const iframe = document.getElementById("outputFrame");
      const doc = iframe.contentDocument || iframe.contentWindow.document;

      const cssCode = code.match(/<style>(.*?)<\/style>/s)?.[1] || "";
      const jsCode = code.match(/<script>(.*?)<\/script>/s)?.[1] || "";
      const htmlOnly = code
        .replace(/<style>.*?<\/style>/s, "")
        .replace(/<script>.*?<\/script>/s, "");

      const fullCode = `
        <!DOCTYPE html>
        <html>
        <head><style>${cssCode}</style></head>
        <body>
          ${htmlOnly}
          <script>${jsCode}</script>
        </body>
        </html>
      `;
      doc.open();
      doc.write(fullCode);
      doc.close();
    }
  };

  const handleClearOutput = () => {
    if (language === "python") {
      setPythonOutput("");
    } else {
      const iframe = document.getElementById("outputFrame");
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write("");
      doc.close();
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], {
      type: language === "python" ? "text/x-python" : "text/html",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = language === "python" ? "code.py" : "code.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      {/* Language selection and actions */}
      <div className="flex flex-wrap items-center space-x-4 mb-4">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="px-4 py-2 border rounded bg-white text-black"
        >
          <option value="html">HTML</option>
          <option value="python">Python</option>
        </select>
        <button onClick={handleRunCode} className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700">Run</button>
        <button onClick={handleClearOutput} className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-700">Clear Output</button>
        <button onClick={handleDownloadCode} className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-800">Download Code</button>
      </div>

      {/* Code Editor */}
      <textarea id="realtimeEditor" className="w-full h-72 text-sm font-mono text-white bg-transparent border-2" />

      {/* Output Area */}
      {language === "html" && (
        <iframe id="outputFrame" title="Output" className="w-full h-72 border mt-4 rounded bg-gray-100" />
      )}
      {language === "python" && (
        <div className="mt-4 p-4 bg-gray-800 text-white rounded h-72 overflow-y-auto">
          <h3 className="font-bold text-lg mb-2">Python Output:</h3>
          <pre>{pythonOutput}</pre>
        </div>
      )}
    </div>
  );
};

export default Editor;
