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
    <title>Default HTML, CSS, and JS Template</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { width: 80%; margin: 0 auto; padding: 20px; }
        button { background-color: #4CAF50; color: white; padding: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <button onclick="changeText()">Click Me</button>
        <p id="text">This is some text.</p>
    </div>
    <script>
        function changeText() {
            document.getElementById('text').innerHTML = "Text changed!";
        }
    </script>
</body>
</html>`;

const Editor = () => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(defaultCode);
  const [changeLog, setChangeLog] = useState([]);

  useEffect(() => {
    editorRef.current = Codemirror.fromTextArea(
      document.getElementById("realtimeEditor"),
      {
        mode: "htmlmixed",
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
    );

    editorRef.current.setValue(code);
    editorRef.current.focus();

    let prevCode = code; // Store last state

    editorRef.current.on("change", (instance) => {
      const newCode = instance.getValue();

      if (newCode !== prevCode) {
        const timestamp = new Date().toLocaleTimeString();
        setChangeLog((prevLog) => [
          ...prevLog,
          {
            time: timestamp,
            oldCode: prevCode,
            newCode: newCode,
          },
        ]);

        prevCode = newCode;
      }

      setCode(newCode);
      localStorage.setItem("sharedCode", newCode);
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

    window.addEventListener("storage", storageListener);

    return () => {
      window.removeEventListener("storage", storageListener);
      editorRef.current?.toTextArea();
    };
  }, []);

  const handleViewResult = () => {
    const iframe = document.getElementById("outputFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    const htmlCode = editorRef.current.getValue();
    const cssCode = htmlCode.match(/<style>(.*?)<\/style>/s)
      ? htmlCode.match(/<style>(.*?)<\/style>/s)[1]
      : "";
    const jsCode = htmlCode.match(/<script>(.*?)<\/script>/s)
      ? htmlCode.match(/<script>(.*?)<\/script>/s)[1]
      : "";

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
        ${htmlCode.replace(/<style>.*?<\/style>/s, "").replace(
          /<script>.*?<\/script>/s,
          ""
        )}
        <script>
          try { 
            ${jsCode} 
          } catch (error) {
            console.error("Error in JavaScript:", error);
          }
        </script>
      </body>
      </html>
    `;

    doc.open();
    doc.write(fullCode);
    doc.close();
  };

  const handleClearScreen = () => {
    setCode("");
    if (editorRef.current) {
      editorRef.current.setValue("");
    }
  };

  return (
    <div className="p-2 shadow-lg flex-col">
      <textarea
        id="realtimeEditor"
        className="w-full h-72 text-base font-mono text-white bg-transparent border-2 focus:outline-none transition-all"
      ></textarea>

      <div className="flex mb-1 mt-1 font-bold">
        <div className="flex space-x-6">
          <button
            onClick={handleViewResult}
            className="px-12 py-2 bg-pink-500 text-white rounded-sm hover:bg-pink-700"
          >
            View
          </button>
          <button
            onClick={handleClearScreen}
            className="px-10 py-2 bg-red-700 text-white rounded-sm hover:bg-red-900"
          >
            Clear Screen
          </button>
        </div>
      </div>

      <div className="flex w-full">
        <iframe
          id="outputFrame"
          title="Output"
          className="w-1/2 h-72 border bg-green-300"
        ></iframe>
      </div>

      <div className="p-2 bg-gray-800 text-white mt-2 h-40 overflow-y-scroll">
        <h3 className="text-lg font-bold">Change Log:</h3>
        <ul>
          {changeLog.map((change, index) => (
            <li key={index} className="mb-2">
              <strong>{change.time}</strong>
              <p className="text-sm text-yellow-400">Previous Code:</p>
              <pre className="bg-gray-900 p-2 text-xs rounded">{change.oldCode}</pre>
              <p className="text-sm text-green-400">New Code:</p>
              <pre className="bg-gray-900 p-2 text-xs rounded">{change.newCode}</pre>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Editor;
