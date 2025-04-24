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
<html>
<head><title>Live Editor</title></head>
<body>
  <h2>Hello from HTML</h2>
  <button onclick="alert('Clicked!')">Click Me</button>
</body>
</html>`;

const defaultPythonCode = `# Python Code
print("Hello, world!")`;

const Editor = () => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(defaultHTMLCode);
  const [selectedLanguage, setSelectedLanguage] = useState('html');
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    const socket = initSocket();

    if (editorRef.current) {
      editorRef.current.toTextArea();
      editorRef.current = null;
    }

    const cm = Codemirror.fromTextArea(document.getElementById("realtimeEditor"), {
      mode: selectedLanguage === 'python' ? 'python' : 'htmlmixed',
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    cm.setValue(code);
    cm.focus();

    cm.on("change", (instance) => {
      const newCode = instance.getValue();
      setCode(newCode);
      socket.emit("codeChange", newCode);
    });

    editorRef.current = cm;

    socket.on("codeChange", (updatedCode) => {
      if (updatedCode !== editorRef.current.getValue()) {
        editorRef.current.setValue(updatedCode);
        setCode(updatedCode);
      }
    });

    return () => {
      socket.disconnect();
      editorRef.current?.toTextArea();
      editorRef.current = null;
    };
  }, [selectedLanguage]);

  const handleViewResult = () => {
    if (selectedLanguage === 'html') {
      const iframe = document.getElementById("outputFrame");
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(editorRef.current.getValue());
      doc.close();
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
    editorRef.current.setValue('');
    setShowOutput(false);
  };

  const handleUndo = () => {
    // TODO: Implement undo functionality if needed
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    const newCode = newLang === 'python' ? defaultPythonCode : defaultHTMLCode;
    setSelectedLanguage(newLang);
    setCode(newCode);
  };

  const handleDownload = () => {
    const blob = new Blob([editorRef.current.getValue()], {
      type: selectedLanguage === 'python' ? 'text/x-python' : 'text/html',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = selectedLanguage === 'python' ? 'code.py' : 'code.html';
    link.click();
  };

  const handleShowOutput = async () => {
    if (selectedLanguage !== 'python') return;

    try {
      const userCode = editorRef.current.getValue();
      console.log("Sending Python code:", userCode);

      const response = await fetch('https://editmantra-backend.onrender.com/python-collaboration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: userCode }),
      });

      if (!response.ok) throw new Error('Failed to execute Python code.');

      const data = await response.json();
      console.log("Received response:", data);

      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.output || "No output returned.");
      }
    } catch (err) {
      console.error(err);
      setOutput(`Execution error: ${err.message}`);
    }

    setShowOutput(true);
  };

  return (
    <div className="p-4 space-y-4">
      <select onChange={handleLanguageChange} value={selectedLanguage} className="p-2 border rounded">
        <option value="html">HTML/JS</option>
        <option value="python">Python</option>
      </select>

      <textarea id="realtimeEditor" className="w-full h-72" />

      <div className="space-x-4">
        <button onClick={handleViewResult} className="px-4 py-2 bg-green-600 text-white rounded">
          Run (HTML/JS)
        </button>
        <button onClick={handleClear} className="px-4 py-2 bg-red-600 text-white rounded">Clear</button>
        <button onClick={handleUndo} className="px-4 py-2 bg-yellow-500 text-white rounded">Undo</button>
        <button onClick={handleDownload} className="px-4 py-2 bg-blue-600 text-white rounded">Download</button>

        {selectedLanguage === 'python' && (
          <button onClick={handleShowOutput} className="px-4 py-2 bg-purple-600 text-white rounded">
            Show Python Output
          </button>
        )}
      </div>

      {selectedLanguage === 'html' ? (
        <iframe id="outputFrame" className="w-full h-72 border" title="HTML Output" />
      ) : (
        showOutput && (
          <div className="w-full h-72 p-4 overflow-auto bg-gray-900 text-white rounded whitespace-pre-wrap">
            {output || "Python output will appear here..."}
          </div>
        )
      )}
    </div>
  );
};

export default Editor;
