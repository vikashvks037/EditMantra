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
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px; }
        button { background-color: #4CAF50; color: white; padding: 10px; border: none; cursor: pointer; }
    </style>
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

const defaultPythonCode = `# Python Code
print("Hello, world!")`;

const Editor = () => {
  const editorRef = useRef(null);
  const prevCodeRef = useRef(defaultHTMLCode); // Store previous code
  const [code, setCode] = useState(defaultHTMLCode);
  const [selectedLanguage, setSelectedLanguage] = useState('html'); // Default language
  const [changeLog, setChangeLog] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [output, setOutput] = useState('');

  useEffect(() => {
    // Initialize socket connection
    const socket = initSocket();
    
    editorRef.current = Codemirror.fromTextArea(document.getElementById("realtimeEditor"), {
      mode: selectedLanguage === 'python' ? 'python' : 'htmlmixed',
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    editorRef.current.setValue(code);
    editorRef.current.focus();

    editorRef.current.on("change", (instance) => {
      const newCode = instance.getValue();
      const prevCode = prevCodeRef.current;

      if (newCode !== prevCode) {
        const timestamp = new Date().toLocaleTimeString();
        
        setChangeLog((prevLog) => [
          ...prevLog,
          { time: timestamp, oldCode: prevCode, newCode },
        ]);

        setHistory((prevHistory) => [...prevHistory, prevCode]);
        setFuture([]); // Clear redo stack when a new change is made

        prevCodeRef.current = newCode; // Update previous code reference
      }

      setCode(newCode);
      localStorage.setItem("sharedCode", newCode);

      // Emit the updated code to all connected users
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

    // Listen for real-time code updates from the socket
    socket.on("codeChange", (updatedCode) => {
      if (updatedCode !== editorRef.current.getValue()) {
        editorRef.current.setValue(updatedCode);
        setCode(updatedCode);
      }
    });

    window.addEventListener("storage", storageListener);

    return () => {
      window.removeEventListener("storage", storageListener);
      socket.disconnect(); // Cleanup socket connection
      editorRef.current?.toTextArea();
    };
  }, [selectedLanguage]);

  const handleViewResult = async () => {
    if (selectedLanguage === 'html') {
      const iframe = document.getElementById("outputFrame");
      const doc = iframe.contentDocument || iframe.contentWindow.document;

      const htmlCode = editorRef.current.getValue();
      const cssCode = htmlCode.match(/<style>(.*?)<\/style>/s) ? htmlCode.match(/<style>(.*?)<\/style>/s)[1] : "";
      const jsCode = htmlCode.match(/<script>(.*?)<\/script>/s) ? htmlCode.match(/<script>(.*?)<\/script>/s)[1] : "";

      const fullCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode.replace(/<style>.*?<\/style>/s, "").replace(/<script>.*?<\/script>/s, "")}
          <script>
            try { ${jsCode} } catch (error) { console.error("Error in JavaScript:", error); }
          </script>
        </body>
        </html>
      `;

      doc.open();
      doc.write(fullCode);
      doc.close();
    } else if (selectedLanguage === 'python') {
      const pythonCode = editorRef.current.getValue();

      try {
        // Send the Python code to the backend for execution
        const response = await fetch('https://editmantra-backend.onrender.com/python-collaboration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: pythonCode }),
        });

        const data = await response.json();

        if (data.error) {
          setOutput("Error: " + data.error);
        } else {
          setOutput("Python output: " + data.output);
        }
      } catch (error) {
        setOutput("Error executing Python code: " + error.message);
      }
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prevCode = history[history.length - 1];
      setFuture((prevFuture) => [code, ...prevFuture]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      editorRef.current.setValue(prevCode);
      setCode(prevCode);
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    if (event.target.value === 'python') {
      setCode(defaultPythonCode);
    } else {
      setCode(defaultHTMLCode);
    }
  };

  const handleDownload = () => {
    const codeContent = editorRef.current.getValue();
    const blob = new Blob([codeContent], { type: selectedLanguage === 'python' ? "text/x-python" : "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedLanguage === 'python' ? "code.py" : "code.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-2 shadow-lg flex-col">
      {/* Language Dropdown */}
      <select onChange={handleLanguageChange} value={selectedLanguage} className="mb-2 p-2 border bg-gray-100">
        <option value="html">HTML/JavaScript</option>
        <option value="python">Python</option>
      </select>

      {/* Code Editor */}
      <textarea id="realtimeEditor" className="w-full h-72 text-base font-mono text-white bg-transparent border-2"></textarea>

      {/* Buttons */}
      <div className="flex space-x-6 my-2">
        <button onClick={handleViewResult} className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-700">Run</button>
        <button onClick={handleClear} className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-700">Clear</button>
        <button onClick={handleUndo} className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Undo</button>
        <button onClick={handleDownload} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-800">Download Code</button>
      </div>

      {/* Output and Change Log */}
      <div className="flex w-full space-x-4 mt-4">
        {/* Left: Output Preview or Python Output */}
        <div className="w-1/2 h-72 border bg-gray-300 rounded">
          {selectedLanguage === 'html' ? (
            <iframe id="outputFrame" title="Output Preview" className="w-full h-full"></iframe>
          ) : (
            <div className="w-full h-full bg-gray-800 text-white p-4">
              {output || "Python Output will appear here..."}
            </div>
          )}
        </div>

        {/* Right: Change Log */}
        <div className="w-1/2 h-72 overflow-auto p-4 bg-gray-100 border rounded">
          <h2 className="text-lg font-semibold">Change Log</h2>
          {changeLog.map((log, index) => (
            <div key={index} className="my-2 p-2 border-b">
              <p><strong>{log.time}</strong></p>
              <p><strong>Previous Code:</strong><br />{log.oldCode}</p>
              <p><strong>New Code:</strong><br />{log.newCode}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;
