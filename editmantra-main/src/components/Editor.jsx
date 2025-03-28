import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

// Default code for HTML, CSS, and JS
const defaultCode = {
  html: `<!DOCTYPE html>
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
}
h1 {
  color: #007BFF;
}`,
  javascript: `console.log('Hello, World!');`,
};

const Editor = () => {
  const editorRef = useRef(null);
  const [code, setCode] = useState({
    html: defaultCode.html,
    css: defaultCode.css,
    javascript: defaultCode.javascript,
  });
  const [consoleOutput, setConsoleOutput] = useState([]); // Store console logs

  // Initialize CodeMirror editor
  useEffect(() => {
    const editor = Codemirror.fromTextArea(
      document.getElementById("realtimeEditor"),
      {
        mode: "htmlmixed", // Supports HTML, CSS, and JavaScript mixed
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        extraKeys: {
          "Ctrl-Space": "autocomplete",
        },
      }
    );

    editorRef.current = editor;

    // Set the initial value
    const initialCode = `${code.html}\n\n/* CSS */\n${code.css}\n\n/* JavaScript */\n${code.javascript}`;
    editor.setValue(initialCode);
    editor.focus();

    // Listen for changes in the editor
    editor.on("change", (instance) => {
      const newCode = instance.getValue();
      setCode({
        html: newCode.split("/* CSS */")[0],
        css: newCode.split("/* CSS */")[1].split("/* JavaScript */")[0],
        javascript: newCode.split("/* JavaScript */")[1],
      });
    });

    return () => {
      editor.toTextArea();
    };
  }, []);

  // Handle view result
  const handleViewResult = () => {
    const iframe = document.getElementById("outputFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    const htmlCode = code.html;
    const cssCode = code.css;
    const jsCode = code.javascript;

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
        ${htmlCode}
        <script>
          try { ${jsCode} } catch (error) {
            console.error("Error in JavaScript:", error);
          }
        </script>
      </body>
      </html>
    `;

    // Clear previous content and inject updated code into iframe
    doc.open();
    doc.write(fullCode);
    doc.close();
  };

  // Clear the editor
  const handleClear = () => {
    setCode({
      html: "",
      css: "",
      javascript: "",
    });
    editorRef.current.setValue("");
  };

  return (
    <div className="p-1 shadow-lg flex-col">
      <div className="flex mb-1 font-bold">
        <div className="flex space-x-6 ml-96">
          <button
            onClick={handleViewResult}
            className="px-4 py-2 bg-pink-500 text-white rounded-sm hover:bg-pink-700"
          >
            Output
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-700 text-white rounded-sm hover:bg-red-900"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        id="realtimeEditor"
        className="w-full h-72 text-base font-mono text-white bg-transparent border-2 focus:outline-none transition-all"
      ></textarea>

      <div className="flex w-full">
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

