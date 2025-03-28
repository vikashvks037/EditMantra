import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import io from "socket.io-client";

const ACTIONS = {
  CODE_CHANGE: "code-change",
  JOIN_ROOM: "join-room",
};

const socket = io("https://editmantra-backend.onrender.com"); // Replace with your backend's URL

const defaultCode = {
  htmlmixed: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>`,
  css: `body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}`,
  javascript: `console.log('Hello, World!');`,
};

// Debounce hook to limit the rate of function calls
const useDebounce = (callback, delay) => {
  const timerRef = useRef(null);

  const debounce = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(callback, delay);
  };

  return debounce;
};

const Editor = ({ roomId }) => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("htmlmixed");
  const [code, setCode] = useState(defaultCode["htmlmixed"]);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isLocalChange, setIsLocalChange] = useState(false);

  // Create debounce function to prevent immediate code change updates
  const debounceCodeChange = useDebounce(() => {
    if (isLocalChange) {
      socket.emit(ACTIONS.CODE_CHANGE, { roomId, code });
      setIsLocalChange(false);
    }
  }, 1000); // Debounce time (in ms)

  // Initialize CodeMirror editor
  useEffect(() => {
    editorRef.current = Codemirror.fromTextArea(
      document.getElementById("realtimeEditor"),
      {
        mode: language,
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
    );

    editorRef.current.setValue(code);

    editorRef.current.on("change", (instance) => {
      const newCode = instance.getValue();
      setCode(newCode);
      setIsLocalChange(true);
      debounceCodeChange(); // Trigger debounce function
    });

    return () => {
      editorRef.current?.toTextArea();
    };
  }, [language]);

  // Handle socket updates
  useEffect(() => {
    socket.emit(ACTIONS.JOIN_ROOM, { roomId });

    socket.on(ACTIONS.CODE_CHANGE, ({ code: newCode }) => {
      if (newCode !== editorRef.current.getValue()) {
        editorRef.current.setValue(newCode);
        setCode(newCode);
      }
    });

    return () => {
      socket.off(ACTIONS.CODE_CHANGE);
    };
  }, [roomId]);

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    const newCode = defaultCode[newLanguage];
    setCode(newCode);
    if (editorRef.current) {
      editorRef.current.setOption("mode", newLanguage);
      editorRef.current.setValue(newCode);
    }
  };

  // Clear editor
  const handleClearScreen = () => {
    setCode("");
    if (editorRef.current) {
      editorRef.current.setValue("");
    }
  };

  // Display merged result
  const handleViewResult = () => {
    const iframe = document.getElementById("outputFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    const htmlCode =
      language === "htmlmixed" ? editorRef.current.getValue() : defaultCode.htmlmixed;
    const cssCode =
      language === "css" ? editorRef.current.getValue() : defaultCode.css;
    const jsCode =
      language === "javascript" ? editorRef.current.getValue() : defaultCode.javascript;

    const fullCode = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>${cssCode}</style>
      </head>
      <body>${htmlCode}
        <script>
          try { ${jsCode} } catch (error) {
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

  // Clear console output
  const clearConsole = () => setConsoleOutput([]);

  return (
    <div className="p-4 shadow-lg flex flex-col space-y-4">
      <div className="flex items-center mb-4 font-bold">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 mr-4 border text-center rounded-md focus:outline-none text-cyan-700 font-semibold"
        >
          <option value="htmlmixed">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
        </select>

        <div className="flex space-x-4 ml-auto">
          <button onClick={handleViewResult} className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-700">
            View Result
          </button>
          <button onClick={handleConsoleOutput} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-800">
            Console Output
          </button>
          <button onClick={clearConsole} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500">
            Clear Console
          </button>
          <button onClick={handleClearScreen} className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-900">
            Clear Screen
          </button>
        </div>
      </div>

      <textarea id="realtimeEditor" className="w-full h-72 text-base font-mono text-white bg-transparent border-2 focus:outline-none transition-all"></textarea>

      <div className="flex w-full mt-4 space-x-4">
        <div className="w-1/2 p-4 bg-gray-700 text-white h-72 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Console Output:</h3>
          <ul className="text-sm space-y-2">
            {consoleOutput.map((line, index) => <li key={index}>{line}</li>)}
          </ul>
        </div>

        <iframe
          id="outputFrame"
          title="Output"
          className="w-1/2 h-72 border bg-green-300"
        ></iframe>
      </div>
    </div>
  );
};

export default Editor;
