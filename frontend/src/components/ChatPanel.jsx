// frontend/src/components/ChatPanel.jsx

import React, { useState } from 'react';
import { chatWithAI } from '../services/api';

const ChatPanel = ({ initialMessage }) => {
  const [history, setHistory] = useState([
    { role: 'user', parts: [{ text: 'Hello, I have a test case generated for me.' }] }, // Dummy user message
    { role: 'model', parts: [{ text: initialMessage }] },
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', parts: [{ text: message }] };
    const newHistory = [...history, userMessage];
    
    setHistory(newHistory);
    setMessage('');
    setLoading(true);

    try {
      const { response } = await chatWithAI(newHistory, message);
      setHistory([...newHistory, { role: 'model', parts: [{ text: response }] }]);
    } catch (error) {
      console.error("Error chatting with AI:", error);
      setHistory([...newHistory, { role: 'model', parts: "Sorry, I encountered an error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="small-screen-only">
        AI-Generated Test Cases & Summaries
      </div>
      <div style={{ marginTop: '20px' }}>
      <h4>Chat with AI about this test case</h4>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
        {history.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
            <strong>{msg.role === 'user' ? 'You' : 'TESTY'}:</strong>
            <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: msg.parts[0].text.replace(/white-space: pre;/g, 'white-space: pre-wrap;') }}></p>
            {/* WARNING: Using dangerouslySetInnerHTML can expose to XSS attacks if content is not sanitized. */}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask for changes or improvements..."
          style={{ width: 'calc(95% - 70px)', padding: '8px', marginTop: '5px' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={{ width: '60px', padding: '8px', marginTop: '5px' }}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
    </>
  );
};

export default ChatPanel;


