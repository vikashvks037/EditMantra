import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

// Default code template
const defaultCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Default HTML, CSS, and JS Template</title>
    <style>
        /* CSS Styling */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        header {
            background-color: #333;
            color: #fff;
            padding: 10px 0;
            text-align: center;
        }

        .container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
        }

        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>

    <header>
        <h1>Welcome to My Page</h1>
    </header>

    <div class="container">
        <h2>HTML, CSS, and JS in One Page</h2>
        <p>This is a simple example demonstrating how to combine HTML, CSS, and JavaScript.</p>

        <button onclick="changeText()">Click Me</button>
        <p id="text">This is some text that will change when you click the button.</p>
    </div>

    <script>
        // JavaScript Function
        function changeText() {
            document.getElementById('text').innerHTML = "You clicked the button! The text has changed.";
        }
    </script>

</body>
</html>`;

const Editor = () => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(defaultCode);
  const [consoleOutput, setConsoleOutput] = useState([]);

  // Initialize CodeMirror editor
  useEffect(() => {
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
      setCode(newCode);
      // Optionally store in localStorage
      localStorage.setItem("sharedCode", newCode);
    });

    // Listen for changes in localStorage (to sync across all tabs)
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

  // View result (html, css, and js in iframe and console output)
  const handleViewResult = () => {
    const iframe = document.getElementById("outputFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    const htmlCode = editorRef.current.getValue();
    const cssCode = htmlCode.match(/<style>(.*?)<\/style>/s) ? htmlCode.match(/<style>(.*?)<\/style>/s)[1] : '';
    const jsCode = htmlCode.match(/<script>(.*?)<\/script>/s) ? htmlCode.match(/<script>(.*?)<\/script>/s)[1] : '';

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
        ${htmlCode.replace(/<style>.*?<\/style>/s, '').replace(/<script>.*?<\/script>/s, '')}
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

    // Inject code into iframe
    doc.open();
    doc.write(fullCode);
    doc.close();
  };

  // Execute JavaScript and log output
  const handleConsoleOutput = () => {
    const jsCode = editorRef.current.getValue();
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const iframeWindow = iframe.contentWindow;

    iframeWindow.console.log = (message) => {
      setConsoleOutput((prev) => [...prev, `> ${message}`]);
    };

    try {
      iframeWindow.eval(jsCode);
    } catch (error) {
      setConsoleOutput((prev) => [...prev, `Error: ${error.message}`]);
    }

    document.body.removeChild(iframe);
  };

  // Clear screen (reset editor)
  const handleClearScreen = () => {
    setCode("");
    if (editorRef.current) {
      editorRef.current.setValue("");
    }
  };

  return (
    <div className="p-1 shadow-lg flex-col">
      <div className="flex mb-1 font-bold">
        <div className="flex space-x-6 ml-96">
          <button onClick={handleViewResult} className="px-4 py-2 bg-pink-500 text-white rounded-sm hover:bg-pink-700">
            View
          </button>
          <button onClick={handleClearScreen} className="px-4 py-2 bg-red-700 text-white rounded-sm hover:bg-red-900">
            Clear Screen
          </button>
        </div>
      </div>

      <textarea id="realtimeEditor" className="w-full h-72 text-base font-mono text-white bg-transparent border-2 focus:outline-none transition-all"></textarea>

      <div className="flex w-full">
        <div className="w-1/2 p-2 bg-gray-700 text-white h-72 overflow-y-scroll mr-2">
          <h3 className="text-lg font-bold">Console Output:</h3>
          <ul>{consoleOutput.map((line, index) => <li key={index}>{line}</li>)}</ul>
        </div>

        <iframe id="outputFrame" title="Output" className="w-1/2 h-72 border bg-green-300"></iframe>
      </div>
    </div>
  );
};

export default Editor;


