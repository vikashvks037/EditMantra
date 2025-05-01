import { initSocket } from '../socket';
import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const defaultCode = `<!DOCTYPE html>
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

const Editor = () => {
  const editorRef = useRef(null);
  const prevCodeRef = useRef(defaultCode); // Store previous code
  const [code, setCode] = useState(defaultCode);
  const [changeLog, setChangeLog] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const lastUpdated = useRef(Date.now()); // Track last update time for periodic log

  useEffect(() => {
    // Initialize socket connection
    const socket = initSocket();
    
    editorRef.current = Codemirror.fromTextArea(document.getElementById("realtimeEditor"), {
      mode: "htmlmixed",
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
        prevCodeRef.current = newCode; // Update previous code reference
        setCode(newCode);
        localStorage.setItem("sharedCode", newCode);

        // Emit the updated code to all connected users
        socket.emit("codeChange", newCode);
      }
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

    // Periodically update the change log every 1 minute
    const interval = setInterval(() => {
      const currentTime = Date.now();
      // Check if 1 minute has passed since the last update
      if (currentTime - lastUpdated.current >= 60000) {
        const timestamp = new Date().toLocaleTimeString();
        setChangeLog((prevLog) => [
          ...prevLog,
          { time: timestamp, oldCode: prevCodeRef.current, newCode: editorRef.current.getValue() },
        ]);
        lastUpdated.current = currentTime;
      }
    }, 60000);

    return () => {
      window.removeEventListener("storage", storageListener);
      socket.disconnect(); // Cleanup socket connection
      editorRef.current?.toTextArea();
      clearInterval(interval); // Cleanup the interval when component unmounts
    };
  }, []);

  const handleViewResult = () => {
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
  };

  const handleDownloadHTML = () => {
    const htmlContent = editorRef.current.getValue();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "code.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <div className="p-2 shadow-lg flex-col">
      {/* Code Editor */}
      <textarea id="realtimeEditor" className="w-full h-72 text-base font-mono text-white bg-transparent border-2"></textarea>

      {/* Buttons */}
      <div className="flex space-x-6 my-2">
        <button onClick={handleViewResult} className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-700">Run</button>
{/*         <button onClick={handleUndo} className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Undo</button> */}
        <button onClick={handleDownloadHTML} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-800">Download Code</button>
      </div>

      {/* Output and Change Log */}
      <div className="flex w-full space-x-4 mt-4">
        {/* Left: Output Preview */}
        <iframe id="outputFrame" title="Output" className="w-1/2 h-72 border bg-gray-300 rounded"></iframe>

        {/* Right: Change Log */}
        <div className="w-1/2 p-2 bg-gray-800 text-white h-72 overflow-y-scroll rounded">
          <h3 className="text-lg font-bold">Change Log:</h3>
          <ul>
            {changeLog.map((change, index) => (
              <li key={index} className="mb-2 border-b border-gray-700 pb-2">
                <strong className="text-yellow-400">{change.time}</strong>
                <p className="text-sm text-yellow-400">Previous Code:</p>
                <pre className="bg-gray-900 p-2 text-xs rounded">{change.oldCode}</pre>
{/*                 <p className="text-sm text-green-400 mt-1">New Code:</p>
                <pre className="bg-gray-900 p-2 text-xs rounded overflow-x-auto">{change.newCode}</pre> */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Editor;
