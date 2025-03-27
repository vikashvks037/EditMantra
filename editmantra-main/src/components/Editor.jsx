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
  const [language, setLanguage] = useState("htmlmixed");
  const [isTyping, setIsTyping] = useState(false); // Track typing to prevent unwanted updates

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

    editorRef.current.setValue(defaultCode[language]);

    // Emit code changes on editor change
    editorRef.current.on("change", (instance) => {
      setIsTyping(true);
      const newCode = instance.getValue();
      socket.emit(ACTIONS.CODE_CHANGE, { roomId, code: newCode });
    });

    return () => {
      editorRef.current?.toTextArea();
    };
  }, [language]);

  // Listen for code changes from the server
  useEffect(() => {
    socket.emit(ACTIONS.JOIN_ROOM, { roomId });

    socket.on(ACTIONS.CODE_CHANGE, ({ code: newCode }) => {
      if (editorRef.current && !isTyping) {
        const cursor = editorRef.current.getCursor(); // Preserve cursor position
        editorRef.current.setValue(newCode);
        setTimeout(() => {
          editorRef.current.setCursor(cursor); // Restore cursor position
        }, 0);
      }
      setIsTyping(false);
    });

    return () => {
      socket.off(ACTIONS.CODE_CHANGE);
    };
  }, [roomId, isTyping]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    if (editorRef.current) {
      editorRef.current.setOption("mode", newLanguage);
      editorRef.current.setValue(defaultCode[newLanguage]);
    }
  };

  return (
    <div>
      <select value={language} onChange={handleLanguageChange}>
        <option value="htmlmixed">HTML</option>
        <option value="css">CSS</option>
        <option value="javascript">JavaScript</option>
      </select>
      <textarea id="realtimeEditor"></textarea>
    </div>
  );
};

export default Editor;
