// _components/TokenDisplay.js
import { useState } from 'react';
const TokenDisplay = ({ token }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    const copyToClipboard = () => {
      navigator.clipboard.writeText(token)
        .then(() => alert('Token copied to clipboard!'))
        .catch(err => console.error('Failed to copy token:', err));
    };
  
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">User Token</h3>
          <div className="space-x-2">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isVisible ? 'Hide' : 'Show'} Token
            </button>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Copy Token
            </button>
          </div>
        </div>
        {isVisible && (
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm font-mono break-all">{token}</p>
          </div>
        )}
      </div>
    );
  };