import React from 'react';

export default function LoadingState({ message = "Generating response..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="flex space-x-1.5 items-center justify-center">
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></span>
      </div>
      <p className="text-xs text-gray-400 font-medium animate-pulse">{message}</p>
    </div>
  );
}
