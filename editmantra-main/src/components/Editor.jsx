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

const socket = io("https://editmantra-backend.onrender.com");

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
  const [code, setCode] = useState(defaultCode["htmlmixed"]);
  const [isLocalChange, setIsLocalChange] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

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

    editorRef.current.on("change", (instance) => {
      const newCode = instance.getValue();
      setCode(newCode);
      setIsLocalChange(true);
      setLastUpdated(new Date().toLocaleTimeString());
    });

    return () => {
      editorRef.current?.toTextArea();
    };
  }, []);

  useEffect(() => {
    if (isLocalChange) {
      socket.emit(ACTIONS.CODE_CHANGE, { roomId, code });
      setIsLocalChange(false);
    }
  }, [code, roomId, isLocalChange]);

  useEffect(() => {
    socket.emit(ACTIONS.JOIN_ROOM, { roomId });

    socket.on(ACTIONS.CODE_CHANGE, ({ code: newCode }) => {
      if (newCode !== editorRef.current.getValue()) {
        editorRef.current.setValue(newCode);
        setCode(newCode);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    });

    return () => {
      socket.off(ACTIONS.CODE_CHANGE);
    };
  }, [roomId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (editorRef.current && editorRef.current.getValue() !== code) {
        editorRef.current.setValue(code);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [code]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleViewResult = () => {
    const iframe = document.getElementById("outputFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    const htmlCode = editorRef.current.getValue();

    const fullCode = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>${defaultCode.css}</style>
      </head>
      <body>
        ${htmlCode}
        <script>
          try { ${defaultCode.javascript} } catch (error) {
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

  const handleDownloadCode = () => {
    const htmlCode = editorRef.current.getValue();

    const fullCode = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Downloaded Page</title>
        <style>${defaultCode.css}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${defaultCode.javascript}<\/script>
      </body>
      </html>
    `;

    const blob = new Blob([fullCode], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "project.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-1 shadow-lg flex-col">
      <div className="flex mb-1 font-bold items-center">
        <div className="flex space-x-4">
          <button onClick={handleViewResult} className="px-4 py-2 bg-pink-500 text-white rounded-sm hover:bg-pink-700">
            View Result
          </button>
          <button onClick={handleDownloadCode} className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-800">
            Download Code
          </button>
        </div>

        <div className="ml-4 px-3 py-2 bg-yellow-100 text-black rounded-md font-mono text-sm shadow-inner">
          <span className="font-bold">Last Code Update:</span> {lastUpdated}
        </div>
      </div>

      <textarea id="realtimeEditor" className="w-full h-72 text-base font-mono text-white bg-transparent border-2 focus:outline-none transition-all"></textarea>

      <div className="flex w-full mt-2">
        <iframe id="outputFrame" title="Output" className="w-full h-72 border bg-green-300"></iframe>
      </div>
    </div>
  );
};

export default Editor;
