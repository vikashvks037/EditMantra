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

const Editor = ({ roomId }) => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("htmlmixed");
  const [code, setCode] = useState(defaultCode["htmlmixed"]);
  const [consoleOutput, setConsoleOutput] = useState([]); // Store console logs
  const [isLocalChange, setIsLocalChange] = useState(false); // Track local changes

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

    // Emit code changes on editor change
    editorRef.current.on("change", (instance) => {
      const newCode = instance.getValue();
      setCode(newCode);
      setIsLocalChange(true);
    });

    return () => {
      editorRef.current?.toTextArea();
    };
  }, [language]);

  // Emit code changes to the socket
  useEffect(() => {
    if (isLocalChange) {
      socket.emit(ACTIONS.CODE_CHANGE, { roomId, code });
      setIsLocalChange(false);
    }
  }, [code, roomId, isLocalChange]);

  // Handle socket updates
  useEffect(() => {
    socket.emit(ACTIONS.JOIN_ROOM, { roomId });

    socket.on(ACTIONS.CODE_CHANGE, ({ code: newCode }) => {
      // Avoid resetting the editor's value if the code is the same
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
    <div className="p-1 shadow-lg flex-col">
      <div className="flex mb-1 font-bold">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-1 mr-2 border text-center rounded-sm focus:outline-none text-cyan-700 font-bold"
        >
          <option value="htmlmixed">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
        </select>

        <div className="flex space-x-6 ml-96">
          <button onClick={handleViewResult} className="px-4 py-2 bg-pink-500 text-white rounded-sm hover:bg-pink-700">
            View Result
          </button>
          <button onClick={handleConsoleOutput} className="px-4 py-2 bg-cyan-600 text-white rounded-sm hover:bg-cyan-800">
            Console Output
          </button>
          <button onClick={clearConsole} className="px-4 py-2 bg-purple-600 text-white rounded-sm hover:bg-purple-500">
            Clear Console
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
