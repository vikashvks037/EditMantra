import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import io from "socket.io-client";

const ACTIONS = {
  CODE_CHANGE: "code-change",
  JOIN_ROOM: "join-room",
};

const socket = io("https://editmantra-backend.onrender.com");

const defaultCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Editor</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333;
    }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <script>
    console.log('Hello from JavaScript!');
  </script>
</body>
</html>`;

const Editor = ({ roomId }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(defaultCode);
  const isRemoteChange = useRef(false);

  // Initialize CodeMirror
  useEffect(() => {
    editorRef.current = Codemirror.fromTextArea(
      document.getElementById("realtimeEditor"),
      {
        mode: "htmlmixed",
        theme: "dracula",
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
      }
    );

    editorRef.current.setValue(code);

    editorRef.current.on("change", (instance) => {
      const newCode = instance.getValue();
      if (!isRemoteChange.current) {
        setCode(newCode);
        socket.emit(ACTIONS.CODE_CHANGE, { roomId, code: newCode });
      }
    });

    return () => {
      editorRef.current?.toTextArea();
    };
  }, []);

  // Join room and handle code sync
  useEffect(() => {
    socket.emit(ACTIONS.JOIN_ROOM, { roomId });

    socket.on(ACTIONS.CODE_CHANGE, ({ code: newCode }) => {
      const currentCode = editorRef.current.getValue();
      if (newCode !== currentCode) {
        isRemoteChange.current = true;
        editorRef.current.setValue(newCode);
        setCode(newCode);
        isRemoteChange.current = false;
      }
    });

    return () => {
      socket.off(ACTIONS.CODE_CHANGE);
    };
  }, [roomId]);

  // View rendered output
  const handleViewResult = () => {
    const iframe = document.getElementById("outputFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(editorRef.current.getValue());
    doc.close();
  };

  // Download code as HTML
  const handleDownloadCode = () => {
    const blob = new Blob([editorRef.current.getValue()], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "project.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-1 shadow-lg flex-col">
      <div className="flex mb-1 font-bold items-center space-x-4">
        <button
          onClick={handleViewResult}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
        >
          View Result
        </button>
        <button
          onClick={handleDownloadCode}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
        >
          Download Code
        </button>
      </div>

      <textarea
        id="realtimeEditor"
        className="w-full h-72 font-mono text-white bg-transparent border-2"
      />

      <iframe
        id="outputFrame"
        title="Output"
        className="w-full h-72 mt-2 border bg-white"
      ></iframe>
    </div>
  );
};

export default Editor;
