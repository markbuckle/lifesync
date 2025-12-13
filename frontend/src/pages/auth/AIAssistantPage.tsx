import React, { useState } from 'react';

const AIAssistantPage: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement AI chat
    console.log('Sending:', message);
    setMessage('');
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-8">AI Assistant</h1>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="text-center text-gray-600 mt-20">
            <p className="text-4xl mb-4">✨</p>
            <p className="text-xl">How can I help you today?</p>
          </div>
        </div>

        <form onSubmit={handleSend} className="border-t pt-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask, search, or make anything..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPage;