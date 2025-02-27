import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import Header from './Header';
import Footer from './Footer';

const Review = () => {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [review, setReview] = useState('');
  const navigate = useNavigate();

  // Function to fetch AI review
  const reviewCode = async () => {
    try {
      const response = await axios.post('https://editmantra-backend.onrender.com/ai/get-review', { code });
      setReview(response.data);
    } catch (error) {
      console.error("Error fetching review:", error);
      setReview("⚠️ Error fetching review. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header and Back Button Wrapper */}
      <div className="relative">
        <Header />
        
        {/* Back Button - Now Properly Aligned Below Header */}
        <div className="mt-5 ml-5 font-bold">
          <button 
            onClick={() => navigate('/Gamification')}
            className="px-4 py-2 bg-cyan-400 rounded-full shadow-md flex items-center space-x-2 
                      hover:bg-blue-600 transition duration-200"
          >
            <span className="text-xl">⬅️</span>
            <span>Previous page</span>
          </button>
        </div>
      </div>

      {/* Main Content - Flex Grow to fill space */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl flex bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Left Side - Code Editor */}
          <div className="w-1/2 p-4 border-r">
            <h2 className="text-lg font-semibold mb-2">Write Your Code:</h2>
            <CodeMirror
              value={code}
              height="300px"
              extensions={[javascript()]}
              theme={dracula}
              onChange={(value) => setCode(value)}
            />
            <button
              onClick={reviewCode}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Get Review
            </button>
          </div>

          {/* Right Side - AI Review Output */}
          <div className="w-1/2 p-4">
            <h2 className="text-lg font-semibold mb-2">AI Review:</h2>
            <div className="border p-3 rounded-md bg-gray-50 h-[300px] overflow-y-auto">
              {review ? (
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    p: ({ node, ...props }) => <p {...props} className="text-gray-700" />,
                    pre: ({ node, ...props }) => <pre {...props} className="bg-gray-200 p-2 rounded-md overflow-x-auto" />,
                    code: ({ node, ...props }) => <code {...props} className="bg-gray-300 px-1 rounded" />
                  }}
                >
                  {review}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500">No review yet. Click "Get Review" to analyze your code.</p>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer at the Bottom */}
      <Footer />
    </div>
  );
};

export default Review;
