import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

const defaultCode = {
  javascript: `console.log("Hello, World!");`,
  htmlmixed: `<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>`,
  css: `body { background-color: lightblue; }`,
};

const Editor = () => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCode.javascript); // Default code for JS

  // Initialize editor
  useEffect(() => {
    editorRef.current = Codemirror.fromTextArea(
      document.getElementById('realtimeEditor'),
      {
        mode: language,
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
    );
    
    editorRef.current.setValue(code);

    // Handle editor changes
    editorRef.current.on('change', (instance, changes) => {
      setCode(instance.getValue());
    });

    return () => {
      editorRef.current.toTextArea();
    };
  }, [language]); // Re-run when the language changes

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    const newCode = defaultCode[newLanguage];
    setCode(newCode);

    if (editorRef.current) {
      editorRef.current.setOption('mode', newLanguage);
      editorRef.current.setValue(newCode);
    }
  };

  // Clear editor
  const handleClearScreen = () => {
    setCode('');
    if (editorRef.current) {
      editorRef.current.setValue('');
    }
  };

  // Handle the "View Result" button click
  const handleViewResult = () => {
    const outputFrame = document.getElementById('outputFrame');
    const outputDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;

    if (language === 'htmlmixed' || language === 'css') {
      // If it's HTML or CSS, we directly inject the code into the iframe's body
      outputDoc.open();
      outputDoc.write(code);
      outputDoc.close();
    } else if (language === 'javascript') {
      // If it's JavaScript, we run the code in the iframe
      outputDoc.open();
      outputDoc.write('<html><body><script>' + code + '</script></body></html>');
      outputDoc.close();
    }
  };

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
          <button
            onClick={handleViewResult}
            className="px-4 py-2 bg-pink-500 text-white rounded-sm hover:bg-pink-700"
          >
            View Result
          </button>
          <button
            onClick={handleClearScreen}
            className="px-4 py-2 bg-red-700 text-white rounded-sm hover:bg-red-900"
          >
            Clear Screen
          </button>
        </div>
      </div>

      <textarea
        id="realtimeEditor"
        className="w-full h-72 text-base font-mono text-white bg-transparent border-2 focus:outline-none transition-all"
      ></textarea>

      <div className="flex w-full">
        <div className="w-1/2 p-2 bg-gray-700 text-white h-72 overflow-y-scroll mr-2">
          <h3 className="text-lg font-bold">Console Output:</h3>
          {/* Display your console output here */}
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

